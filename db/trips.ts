import { randomUUID } from "node:crypto";
import type { PoolClient } from "pg";
import type { Comment, Place, Trip, User } from "@/types";
import { query, withTransaction } from "./client";
import {
  groupByTripId,
  mapDbTripToTrip,
  mapDbTripToTripPreview,
  mapDbUserToUser,
} from "./mappers";
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

export async function getAllTravelData(
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

export async function getTripById(tripId: string): Promise<Trip | undefined> {
  const trips = await loadTripsByQuery(
    `SELECT ${TRIP_SELECT_COLUMNS} FROM trips WHERE id = $1 LIMIT 1`,
    [tripId],
  );
  return trips[0];
}

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

  const trip = await getTripById(tripId);
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

  return (await getTripById(tripId)) ?? null;
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

  return getTripById(tripId);
}
