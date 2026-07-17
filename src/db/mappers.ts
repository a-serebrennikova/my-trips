import type { Comment, Place, Trip, User } from "@/src/types";
import type { DbComment, DbPlace, DbTrip, DbTripLike, DbUser } from "./types";

export function groupByTripId<T extends { trip_id: string }>(
  items: T[],
): Map<string, T[]> {
  const grouped = new Map<string, T[]>();
  for (const item of items) {
    const current = grouped.get(item.trip_id);
    if (current) {
      current.push(item);
    } else {
      grouped.set(item.trip_id, [item]);
    }
  }
  return grouped;
}

export function mapDbPlacesToPlaces(
  places: DbPlace[],
  type: "attraction" | "cafe",
): Place[] {
  return places
    .filter((p) => p.type === type)
    .map((p) => ({
      id: p.id,
      name: p.name,
      city: p.city,
      note: p.note ?? undefined,
    }));
}

export function mapDbCommentsToComments(commentsRows: DbComment[]): Comment[] {
  return commentsRows.map((c) => ({
    id: c.id,
    tripId: c.trip_id,
    authorId: c.author_id,
    message: c.message,
    createdAt: c.created_at,
  }));
}

export function mapDbTripToTrip(
  db: DbTrip,
  related: {
    places: DbPlace[];
    comments: DbComment[];
    likes: DbTripLike[];
  },
): Trip {
  const attractions = mapDbPlacesToPlaces(related.places, "attraction");
  const cafes = mapDbPlacesToPlaces(related.places, "cafe");
  const comments = mapDbCommentsToComments(related.comments);

  return {
    id: db.id,
    userId: db.user_id,
    title: db.title,
    city: db.city,
    country: db.country,
    startDate: db.start_date,
    endDate: db.end_date,
    days: db.days,
    approximateCost: db.approximate_cost,
    currency: db.currency as Trip["currency"],
    rating: db.rating,
    coverImage: db.cover_image,
    notes: db.notes ?? undefined,
    attractions,
    cafes,
    createdAt: db.created_at,
    likedByUserIds: related.likes.map((like) => like.user_id),
    comments,
  };
}

export function mapDbTripToTripPreview(
  db: DbTrip,
  related: { likes: DbTripLike[] },
): Trip {
  return {
    id: db.id,
    userId: db.user_id,
    title: db.title,
    city: db.city,
    country: db.country,
    startDate: db.start_date,
    endDate: db.end_date,
    days: db.days,
    approximateCost: db.approximate_cost,
    currency: db.currency as Trip["currency"],
    rating: db.rating,
    coverImage: db.cover_image,
    notes: db.notes ?? undefined,
    attractions: [],
    cafes: [],
    createdAt: db.created_at,
    likedByUserIds: related.likes.map((like) => like.user_id),
    comments: [],
  };
}

export function mapDbUserToUser(db: DbUser): User {
  return {
    id: db.id,
    name: db.name,
    email: db.email,
    avatarColor: db.avatar_color,
    homeCity: db.home_city,
  };
}
