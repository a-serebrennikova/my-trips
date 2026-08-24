import {
  CURRENCY,
  type Comment,
  type Currency,
  type Photo,
  type Place,
  type Trip,
  type User,
} from "@/src/types";
import type {
  DbCommentWithAuthor,
  DbPlace,
  DbPhoto,
  DbTripLike,
  DbTripWithAuthor,
  DbUser,
} from "./types";

const CURRENCY_SYMBOL_TO_CODE: Record<string, Currency> = {
  "₽": "RUB",
  "€": "EUR",
  $: "USD",
};

function mapDbCurrencyToCurrency(value: string): Currency {
  if (value in CURRENCY) {
    return value as Currency;
  }

  const mapped = CURRENCY_SYMBOL_TO_CODE[value];
  if (mapped) {
    return mapped;
  }

  return "RUB";
}

function mapDbAuthorInfo(
  id: string,
  name?: string | null,
  avatarUrl?: string | null,
) {
  return {
    id,
    name: name || "Unknown",
    avatarUrl: avatarUrl ?? null,
  };
}

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
  photosByPlaceId: Map<string, Photo[]> = new Map(),
): Place[] {
  return places
    .filter((p) => p.type === type)
    .map((p) => ({
      id: p.id,
      name: p.name,
      city: p.city,
      note: p.note ?? undefined,
      photos: photosByPlaceId.get(p.id) ?? [],
    }));
}

export function mapDbPhotosToPhotos(photos: DbPhoto[]): Photo[] {
  return photos
    .toSorted((first, second) => first.sort_order - second.sort_order)
    .map((photo) => ({
      id: photo.id,
      url: photo.url,
      publicId: photo.public_id,
      format: photo.format,
      bytes: photo.bytes,
      width: photo.width,
      height: photo.height,
      sortOrder: photo.sort_order,
    }));
}

export function mapDbCommentsToComments(
  commentsRows: DbCommentWithAuthor[],
): Comment[] {
  return commentsRows
    .filter((c) => c.author_id && c.author_name) // Filter out comments with deleted authors
    .map((c) => ({
      id: c.id,
      tripId: c.trip_id,
      authorId: c.author_id,
      author: mapDbAuthorInfo(c.author_id, c.author_name, c.avatar_url),
      message: c.message,
      createdAt: c.created_at,
    }));
}

export function mapDbTripToTrip(
  db: DbTripWithAuthor,
  related: {
    places: DbPlace[];
    tripPhotos: DbPhoto[];
    photosByPlaceId: Map<string, Photo[]>;
    comments: DbCommentWithAuthor[];
    likes: DbTripLike[];
  },
): Trip {
  const attractions = mapDbPlacesToPlaces(
    related.places,
    "attraction",
    related.photosByPlaceId,
  );
  const cafes = mapDbPlacesToPlaces(
    related.places,
    "cafe",
    related.photosByPlaceId,
  );
  const comments = mapDbCommentsToComments(related.comments);

  return {
    id: db.id,
    userId: db.user_id,
    author: mapDbAuthorInfo(db.user_id, db.author_name, db.avatar_url),
    title: db.title,
    city: db.city,
    country: db.country,
    startDate: db.start_date,
    endDate: db.end_date,
    days: db.days,
    approximateCost: db.approximate_cost,
    currency: mapDbCurrencyToCurrency(db.currency),
    notes: db.notes ?? undefined,
    photos: mapDbPhotosToPhotos(related.tripPhotos),
    attractions,
    cafes,
    createdAt: db.created_at,
    likedByUserIds: related.likes.map((like) => like.user_id),
    comments,
  };
}

export function mapDbTripToTripPreview(
  db: DbTripWithAuthor,
  related: { likes: DbTripLike[] },
): Trip {
  return {
    id: db.id,
    userId: db.user_id,
    author: mapDbAuthorInfo(db.user_id, db.author_name, db.avatar_url),
    title: db.title,
    city: db.city,
    country: db.country,
    startDate: db.start_date,
    endDate: db.end_date,
    days: db.days,
    approximateCost: db.approximate_cost,
    currency: mapDbCurrencyToCurrency(db.currency),
    notes: db.notes ?? undefined,
    photos: [],
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
    avatarUrl: db.avatar_url ?? null,
    homeCity: db.home_city,
  };
}
