import type { User, Trip, Comment } from "./travelStore";

export type TravelSnapshot = {
  users: User[];
  trips: Trip[];
  totalTrips: number;
};

const BASE_URL = process.env.NEXT_URL ?? "http://localhost:3000";

export async function fetchTravelData(
  limit: number = 10,
  offset: number = 0,
): Promise<TravelSnapshot> {
  const response = await fetch(
    `${BASE_URL}/api/travel?limit=${limit}&offset=${offset}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: { tags: ["travelData"] },
    },
  );
  if (!response.ok) {
    throw new Error("Не удалось загрузить данные о путешествиях");
  }
  return (await response.json()) as TravelSnapshot;
}

export async function fetchUserData(userId?: string): Promise<TravelSnapshot> {
  const response = await fetch(`${BASE_URL}/api/travel/me`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
    next: { tags: ["travelData"] },
  });

  if (!response.ok) {
    throw new Error("Не удалось загрузить данные о пользователе");
  }
  return (await response.json()) as TravelSnapshot;
}

export async function createTrip(
  input: Omit<Trip, "id" | "createdAt" | "likedByUserIds">,
): Promise<Trip> {
  const response = await fetch(`${BASE_URL}/api/travel/trips`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("Не удалось создать путешествие");
  }

  return (await response.json()) as Trip;
}

export async function addCommentToTrip(
  tripId: string,
  authorId: string,
  message: string,
): Promise<Comment> {
  const response = await fetch(
    `${BASE_URL}/api/travel/trips/${encodeURIComponent(tripId)}/comments`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ authorId, message }),
    },
  );

  if (!response.ok) {
    throw new Error("Не удалось добавить комментарий");
  }

  return (await response.json()) as Comment;
}

export async function updateTrip(
  tripId: string,
  patch: Partial<Trip>,
): Promise<Trip> {
  const response = await fetch(
    `${BASE_URL}/api/travel/trips/${encodeURIComponent(tripId)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    },
  );

  if (!response.ok) {
    throw new Error("Не удалось обновить путешествие");
  }

  return (await response.json()) as Trip;
}

export async function deleteTrip(tripId: string): Promise<void> {
  const response = await fetch(
    `${BASE_URL}/api/travel/trips/${encodeURIComponent(tripId)}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error("Не удалось удалить путешествие");
  }
}

export async function toggleTripLike(
  tripId: string,
  userId: string,
): Promise<Trip> {
  const response = await fetch(
    `${BASE_URL}/api/travel/trips/${encodeURIComponent(tripId)}/like`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    },
  );

  if (!response.ok) {
    throw new Error("Не удалось обновить лайк");
  }

  return (await response.json()) as Trip;
}
