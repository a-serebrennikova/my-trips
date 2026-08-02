import { randomUUID } from "node:crypto";
import type { PoolClient } from "pg";
import { unstable_cache } from "next/cache";
import type { Comment, Place, Trip, User } from "@/src/types";
import { query, withTransaction } from "./client";
import {
  groupByTripId,
  mapDbTripToTrip,
  mapDbTripToTripPreview,
  mapDbUserToUser,
} from "./mappers";
import {
  type DbFriendProfileStatsRow,
  type DbFriendSummaryRow,
  type FriendProfileData,
  type FriendSummary,
  READ_MODEL_REVALIDATE_SECONDS,
} from "./read-models";
import {
  type DbComment,
  type DbPlace,
  type DbTrip,
  type DbTripLike,
  type DbUser,
  TRIP_SELECT_COLUMNS,
  USER_PUBLIC_SELECT_COLUMNS,
} from "./types";

async function loadTripsByQuery(
  tripSql: string,
  params: unknown[],
): Promise<Trip[]> {
  const tripResult = await query<DbTrip>(tripSql, params);
  const trips = tripResult.rows;
  if (trips.length === 0) return [];

  const tripIds = trips.map((t) => t.id);

  const [placesResult, commentsResult, likesResult] = await Promise.all([
    query<DbPlace>(
      `SELECT id, name, city, note, trip_id, type FROM places WHERE trip_id = ANY($1::text[])`,
      [tripIds],
    ),
    query<DbComment>(
      `SELECT id, trip_id, author_id, message, created_at FROM comments WHERE trip_id = ANY($1::text[])`,
      [tripIds],
    ),
    query<DbTripLike>(
      `SELECT trip_id, user_id FROM trip_likes WHERE trip_id = ANY($1::text[])`,
      [tripIds],
    ),
  ]);

  const placesByTripId = groupByTripId(placesResult.rows);
  const commentsByTripId = groupByTripId(commentsResult.rows);
  const likesByTripId = groupByTripId(likesResult.rows);

  return trips.map((trip) => {
    const tripId = trip.id;
    return mapDbTripToTrip(trip, {
      places: placesByTripId.get(tripId) ?? [],
      comments: commentsByTripId.get(tripId) ?? [],
      likes: likesByTripId.get(tripId) ?? [],
    });
  });
}

async function loadTripPreviewsByQuery(
  tripSql: string,
  params: unknown[],
): Promise<Trip[]> {
  const tripResult = await query<DbTrip>(tripSql, params);
  const trips = tripResult.rows;
  if (trips.length === 0) return [];

  const tripIds = trips.map((t) => t.id);
  const likesResult = await query<DbTripLike>(
    `SELECT trip_id, user_id FROM trip_likes WHERE trip_id = ANY($1::text[])`,
    [tripIds],
  );

  const likesByTripId = groupByTripId(likesResult.rows);

  return trips.map((trip) => {
    const tripId = trip.id;
    return mapDbTripToTripPreview(trip, {
      likes: likesByTripId.get(tripId) ?? [],
    });
  });
}

async function insertPlaces(
  client: PoolClient,
  tripId: string,
  cityFallback: string,
  places: Array<Place & { type: "attraction" | "cafe" }>,
) {
  for (const place of places) {
    await client.query(
      `INSERT INTO places (id, trip_id, name, city, note, type) VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        place.id || randomUUID(),
        tripId,
        place.name,
        place.city || cityFallback,
        place.note ?? null,
        place.type,
      ],
    );
  }
}

export async function getUserTravelData(
  userId: string,
): Promise<{ trips: Trip[] }> {
  const trips = await loadTripsByQuery(
    `SELECT ${TRIP_SELECT_COLUMNS} FROM trips WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId],
  );
  return { trips };
}

async function getAllTravelDataRaw(
  limit = 10,
  offset = 0,
): Promise<{ users: User[]; trips: Trip[]; totalTrips: number }> {
  const [usersResult, totalTripsResult, trips] = await Promise.all([
    query<DbUser>(`SELECT ${USER_PUBLIC_SELECT_COLUMNS} FROM users`),
    query<{ count: string }>(`SELECT COUNT(*)::text AS count FROM trips`),
    loadTripPreviewsByQuery(
      `SELECT ${TRIP_SELECT_COLUMNS} FROM trips ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset],
    ),
  ]);

  return {
    users: usersResult.rows.map(mapDbUserToUser),
    trips,
    totalTrips: Number(totalTripsResult.rows[0]?.count || "0"),
  };
}

async function getTripByIdRaw(tripId: string): Promise<Trip | undefined> {
  const trips = await loadTripsByQuery(
    `SELECT ${TRIP_SELECT_COLUMNS} FROM trips WHERE id = $1 LIMIT 1`,
    [tripId],
  );
  return trips[0];
}

async function getFriendsSummaryRaw(
  currentUserId: string,
): Promise<FriendSummary[]> {
  const result = await query<DbFriendSummaryRow>(
    `SELECT
       u.id,
       u.name,
       u.email,
       u.avatar_color,
       u.home_city,
       COALESCE(stats.trips_count, 0)::int AS trips_count,
       COALESCE(stats.likes_received, 0)::int AS likes_received,
       stats.latest_trip_date
     FROM users u
     LEFT JOIN (
       SELECT
         t.user_id,
         COUNT(*)::int AS trips_count,
         COALESCE(SUM(like_stats.likes_count), 0)::int AS likes_received,
         MAX(t.start_date) AS latest_trip_date
       FROM trips t
       LEFT JOIN (
         SELECT trip_id, COUNT(*)::int AS likes_count
         FROM trip_likes
         GROUP BY trip_id
       ) like_stats ON like_stats.trip_id = t.id
       GROUP BY t.user_id
     ) stats ON stats.user_id = u.id
     WHERE u.id <> $1
     ORDER BY COALESCE(stats.trips_count, 0) DESC, u.name ASC`,
    [currentUserId],
  );

  return result.rows.map((row) => ({
    user: mapDbUserToUser(row),
    tripsCount: Number(row.trips_count) || 0,
    likesReceived: Number(row.likes_received) || 0,
    latestTripDate: row.latest_trip_date,
  }));
}

async function getFriendProfileDataRaw(
  userId: string,
): Promise<FriendProfileData | null> {
  const [userResult, trips, statsResult] = await Promise.all([
    query<DbUser>(
      `SELECT ${USER_PUBLIC_SELECT_COLUMNS} FROM users WHERE id = $1 LIMIT 1`,
      [userId],
    ),
    loadTripPreviewsByQuery(
      `SELECT ${TRIP_SELECT_COLUMNS} FROM trips WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId],
    ),
    query<DbFriendProfileStatsRow>(
      `WITH user_trips AS (
         SELECT id, country, rating, start_date
         FROM trips
         WHERE user_id = $1
       )
       SELECT
         (SELECT COUNT(*)::int FROM user_trips) AS trips_count,
         (
           SELECT COUNT(*)::int
           FROM trip_likes tl
           INNER JOIN user_trips ut ON ut.id = tl.trip_id
         ) AS likes_received,
         (SELECT COUNT(DISTINCT country)::int FROM user_trips) AS countries_count,
         (SELECT ROUND(AVG(rating)::numeric, 1) FROM user_trips) AS avg_rating,
         (SELECT MAX(start_date) FROM user_trips) AS latest_trip_date`,
      [userId],
    ),
  ]);

  const user = userResult.rows[0];
  if (!user) {
    return null;
  }

  const statsRow = statsResult.rows[0];
  const avgRating = statsRow.avg_rating;

  return {
    user: mapDbUserToUser(user),
    trips,
    stats: {
      tripsCount: Number(statsRow.trips_count) || 0,
      likesReceived: Number(statsRow.likes_received) || 0,
      countriesCount: Number(statsRow.countries_count) || 0,
      avgRating: avgRating == null ? null : String(avgRating),
      latestTripDate: statsRow.latest_trip_date,
    },
  };
}

export const getAllTravelData = unstable_cache(
  getAllTravelDataRaw,
  ["all-travel-data"],
  { revalidate: READ_MODEL_REVALIDATE_SECONDS },
);

export const getTripById = unstable_cache(getTripByIdRaw, ["trip-by-id"], {
  revalidate: READ_MODEL_REVALIDATE_SECONDS,
});

export const getFriendsSummary = unstable_cache(
  getFriendsSummaryRaw,
  ["friends-summary"],
  { revalidate: READ_MODEL_REVALIDATE_SECONDS },
);

export const getFriendProfileData = unstable_cache(
  getFriendProfileDataRaw,
  ["friend-profile-data"],
  { revalidate: READ_MODEL_REVALIDATE_SECONDS },
);

export async function createTrip(
  userId: string,
  input: Omit<Trip, "id" | "userId" | "createdAt" | "likedByUserIds">,
): Promise<Trip> {
  const tripId = randomUUID();
  const createdAt = new Date().toISOString();

  await withTransaction(async (client) => {
    await client.query(
      `INSERT INTO trips (id, user_id, title, city, country, start_date, end_date, days, approximate_cost, currency, rating, cover_image, notes, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
      [
        tripId,
        userId,
        input.title,
        input.city,
        input.country,
        input.startDate,
        input.endDate,
        input.days,
        input.approximateCost,
        input.currency,
        input.rating,
        input.coverImage,
        input.notes ?? null,
        createdAt,
      ],
    );

    const attractions = input.attractions.map((p) => ({
      ...p,
      type: "attraction" as const,
    }));
    const cafes = input.cafes.map((p) => ({ ...p, type: "cafe" as const }));
    await insertPlaces(client, tripId, input.city, [...attractions, ...cafes]);
  });

  const trip = await getTripByIdRaw(tripId);
  if (!trip) throw new Error("Failed to create trip");
  return trip;
}

export async function updateTrip(
  tripId: string,
  patch: Partial<Trip>,
): Promise<Trip | null> {
  const existing = await query<DbTrip>(
    `SELECT id, city FROM trips WHERE id = $1 LIMIT 1`,
    [tripId],
  );
  if (!existing.rows[0]) return null;

  await withTransaction(async (client) => {
    const updates: string[] = [];
    const values: unknown[] = [];
    let index = 1;

    const append = (column: string, value: unknown) => {
      updates.push(`${column} = $${index}`);
      values.push(value);
      index += 1;
    };

    if (patch.title != null) append("title", patch.title);
    if (patch.city != null) append("city", patch.city);
    if (patch.country != null) append("country", patch.country);
    if (patch.startDate != null) append("start_date", patch.startDate);
    if (patch.endDate != null) append("end_date", patch.endDate);
    if (patch.days != null) append("days", patch.days);
    if (patch.approximateCost != null)
      append("approximate_cost", patch.approximateCost);
    if (patch.currency != null) append("currency", patch.currency);
    if (patch.rating != null) append("rating", patch.rating);
    if (patch.coverImage != null) append("cover_image", patch.coverImage);
    if (patch.notes != null) append("notes", patch.notes);

    if (updates.length > 0) {
      values.push(tripId);
      await client.query(
        `UPDATE trips SET ${updates.join(", ")} WHERE id = $${index}`,
        values,
      );
    }

    if (patch.attractions != null || patch.cafes != null) {
      await client.query(`DELETE FROM places WHERE trip_id = $1`, [tripId]);
      const cityFallback = patch.city ?? existing.rows[0].city;
      const attractions = (patch.attractions ?? []).map((p) => ({
        ...p,
        type: "attraction" as const,
      }));
      const cafes = (patch.cafes ?? []).map((p) => ({
        ...p,
        type: "cafe" as const,
      }));
      await insertPlaces(client, tripId, cityFallback, [
        ...attractions,
        ...cafes,
      ]);
    }
  });

  return (await getTripByIdRaw(tripId)) ?? null;
}

export async function deleteTrip(tripId: string): Promise<boolean> {
  const result = await query<{ id: string }>(
    `DELETE FROM trips WHERE id = $1 RETURNING id`,
    [tripId],
  );
  return (result.rowCount ?? 0) > 0;
}

export async function createComment(
  tripId: string,
  authorId: string,
  message: string,
): Promise<Comment> {
  const normalizedMessage = message.trim();
  const commentId = randomUUID();
  const createdAt = new Date().toISOString();

  await query(
    `INSERT INTO comments (id, trip_id, author_id, message, created_at) VALUES ($1, $2, $3, $4, $5)`,
    [commentId, tripId, authorId, normalizedMessage, createdAt],
  );

  return {
    id: commentId,
    tripId,
    authorId,
    message: normalizedMessage,
    createdAt,
  };
}

export async function toggleTripLike(
  tripId: string,
  userId: string,
): Promise<Trip | undefined> {
  await withTransaction(async (client) => {
    const existing = await client.query<DbTripLike>(
      `SELECT trip_id, user_id FROM trip_likes WHERE trip_id = $1 AND user_id = $2 LIMIT 1`,
      [tripId, userId],
    );

    if (existing.rows[0]) {
      await client.query(
        `DELETE FROM trip_likes WHERE trip_id = $1 AND user_id = $2`,
        [tripId, userId],
      );
    } else {
      await client.query(
        `INSERT INTO trip_likes (trip_id, user_id) VALUES ($1, $2)`,
        [tripId, userId],
      );
    }
  });

  return getTripByIdRaw(tripId);
}
