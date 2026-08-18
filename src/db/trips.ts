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
  type UserProfileData,
  type FriendSummary,
  READ_MODEL_REVALIDATE_SECONDS,
} from "./read-models";
import {
  type DbCommentWithAuthor,
  type DbPlace,
  type DbTrip,
  type DbTripLike,
  type DbTripWithAuthor,
  type DbUser,
  USER_PUBLIC_SELECT_COLUMNS,
} from "./types";

async function loadTripsByQuery(
  tripSql: string,
  params: unknown[],
): Promise<Trip[]> {
  const tripResult = await query<DbTripWithAuthor>(tripSql, params);
  const trips = tripResult.rows;
  if (trips.length === 0) return [];

  const tripIds = trips.map((t) => t.id);

  const [placesResult, commentsResult, likesResult] = await Promise.all([
    query<DbPlace>(
      `SELECT id, name, city, note, trip_id, type FROM places WHERE trip_id = ANY($1::text[])`,
      [tripIds],
    ),
    query<DbCommentWithAuthor>(
      `SELECT c.id, c.trip_id, c.author_id, c.message, c.created_at, u.name as author_name, u.avatar_color
       FROM comments c
       LEFT JOIN users u ON c.author_id = u.id
       WHERE c.trip_id = ANY($1::text[])`,
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
  const tripResult = await query<DbTripWithAuthor>(tripSql, params);
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

type TripWriteInput = {
  title: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  days: number;
  approximateCost: number;
  currency: Trip["currency"];
  notes?: string;
  attractions: Place[];
  cafes: Place[];
};

export async function getUserTravelData(
  userId: string,
): Promise<{ trips: Trip[] }> {
  const trips = await loadTripsByQuery(
    `SELECT trips.id, trips.user_id, trips.title, trips.city, trips.country, trips.start_date, trips.end_date, trips.days, trips.approximate_cost, trips.currency, trips.notes, trips.created_at, u.name as author_name, u.avatar_color FROM trips 
     LEFT JOIN users u ON trips.user_id = u.id 
     WHERE trips.user_id = $1 ORDER BY trips.created_at DESC`,
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
      `SELECT trips.id, trips.user_id, trips.title, trips.city, trips.country, trips.start_date, trips.end_date, trips.days, trips.approximate_cost, trips.currency, trips.notes, trips.created_at, u.name as author_name, u.avatar_color FROM trips
       LEFT JOIN users u ON trips.user_id = u.id
       ORDER BY trips.created_at DESC LIMIT $1 OFFSET $2`,
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
    `SELECT trips.id, trips.user_id, trips.title, trips.city, trips.country, trips.start_date, trips.end_date, trips.days, trips.approximate_cost, trips.currency, trips.notes, trips.created_at, u.name as author_name, u.avatar_color FROM trips
     LEFT JOIN users u ON trips.user_id = u.id
     WHERE trips.id = $1 LIMIT 1`,
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
): Promise<UserProfileData | null> {
  const [userResult, trips, statsResult] = await Promise.all([
    query<DbUser>(
      `SELECT ${USER_PUBLIC_SELECT_COLUMNS} FROM users WHERE id = $1 LIMIT 1`,
      [userId],
    ),
    loadTripPreviewsByQuery(
      `SELECT trips.id, trips.user_id, trips.title, trips.city, trips.country, trips.start_date, trips.end_date, trips.days, trips.approximate_cost, trips.currency, trips.notes, trips.created_at, u.name as author_name, u.avatar_color FROM trips
       LEFT JOIN users u ON trips.user_id = u.id
       WHERE trips.user_id = $1 ORDER BY trips.created_at DESC`,
      [userId],
    ),
    query<DbFriendProfileStatsRow>(
      `WITH user_trips AS (
         SELECT id, country, start_date
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
         (SELECT MAX(start_date) FROM user_trips) AS latest_trip_date`,
      [userId],
    ),
  ]);

  const user = userResult.rows[0];
  if (!user) {
    return null;
  }

  const statsRow = statsResult.rows[0];

  return {
    user: mapDbUserToUser(user),
    trips,
    stats: {
      tripsCount: Number(statsRow.trips_count) || 0,
      likesReceived: Number(statsRow.likes_received) || 0,
      countriesCount: Number(statsRow.countries_count) || 0,
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
  input: TripWriteInput,
): Promise<Trip> {
  const tripId = randomUUID();
  const createdAt = new Date().toISOString();

  await withTransaction(async (client) => {
    await client.query(
      `INSERT INTO trips (id, user_id, title, city, country, start_date, end_date, days, approximate_cost, currency, notes, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
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
  return await withTransaction(async (client) => {
    await client.query(`DELETE FROM trip_likes WHERE trip_id = $1`, [tripId]);
    await client.query(`DELETE FROM comments WHERE trip_id = $1`, [tripId]);
    await client.query(`DELETE FROM places WHERE trip_id = $1`, [tripId]);

    const result = await client.query<{ id: string }>(
      `DELETE FROM trips WHERE id = $1 RETURNING id`,
      [tripId],
    );

    return (result.rowCount ?? 0) > 0;
  });
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

  const userResult = await query<DbUser>(
    `SELECT id, name, avatar_color FROM users WHERE id = $1 LIMIT 1`,
    [authorId],
  );

  const author = userResult.rows[0];

  return {
    id: commentId,
    tripId,
    authorId,
    author: {
      id: authorId,
      name: author?.name || "Unknown",
      avatarColor: author?.avatar_color || "gray",
    },
    message: normalizedMessage,
    createdAt,
  };
}

export async function deleteComment(
  tripId: string,
  commentId: string,
  userId: string,
): Promise<boolean> {
  const result = await query<{ id: string }>(
    `DELETE FROM comments
     WHERE id = $1
       AND trip_id = $2
       AND author_id = $3
     RETURNING id`,
    [commentId, tripId, userId],
  );

  return (result.rowCount ?? 0) > 0;
}

export async function toggleTripLike(
  tripId: string,
  userId: string,
): Promise<string[]> {
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

  const result = await query<Pick<DbTripLike, "user_id">>(
    `SELECT user_id FROM trip_likes WHERE trip_id = $1`,
    [tripId],
  );
  return result.rows.map((r) => r.user_id);
}
