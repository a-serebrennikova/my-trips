import type { User, Trip, Comment } from "@/types";

export type TravelSnapshot = {
  users: User[];
  trips: Trip[];
  totalTrips: number;
};

type AuthUsersResponse = {
  users: User[];
};

type LoginResponse = {
  user: User;
  token: string;
};

const PUBLIC_REVALIDATE_SECONDS = 30;
const DEMO_USERS_REVALIDATE_SECONDS = 300;

function apiUrl(path: string): string {
  if (typeof window !== "undefined") {
    return path;
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.APP_URL ??
    `http://localhost:${process.env.PORT ?? "3000"}`;

  return `${baseUrl}${path}`;
}

export async function fetchTravelData(
  limit: number = 10,
  offset: number = 0,
): Promise<TravelSnapshot> {
  const response = await fetch(
    apiUrl(`/api/travel/trips?limit=${limit}&offset=${offset}`),
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: {
        revalidate: PUBLIC_REVALIDATE_SECONDS,
        tags: ["travelData"],
      },
    },
  );
  if (!response.ok) {
    throw new Error("Failed to load travel data");
  }
  return (await response.json()) as TravelSnapshot;
}

export async function fetchTripById(tripId: string): Promise<Trip | null> {
  const response = await fetch(
    apiUrl(`/api/travel/trips/${encodeURIComponent(tripId)}`),
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: {
        revalidate: PUBLIC_REVALIDATE_SECONDS,
        tags: ["travelData", `trip:${tripId}`],
      },
    },
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to load trip");
  }

  return (await response.json()) as Trip;
}

export async function fetchUserData(token: string): Promise<TravelSnapshot> {
  const response = await fetch(apiUrl(`/api/auth/me`), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
    next: { tags: ["travelData"] },
  });

  if (!response.ok) {
    throw new Error("Failed to load user data");
  }
  return (await response.json()) as TravelSnapshot;
}

export async function fetchDemoUsers(): Promise<User[]> {
  const response = await fetch(apiUrl(`/api/auth/users`), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    next: { revalidate: DEMO_USERS_REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error("Failed to load users");
  }

  const data = (await response.json()) as AuthUsersResponse;
  return data.users;
}

export async function loginUser(
  email: string,
  password: string,
): Promise<{ user: User; token: string }> {
  const response = await fetch(apiUrl(`/api/auth/login`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Invalid email or password");
  }

  const data = (await response.json()) as LoginResponse;
  return { user: data.user, token: data.token };
}

export async function createTrip(
  input: Omit<Trip, "id" | "userId" | "createdAt" | "likedByUserIds">,
  token: string,
): Promise<Trip> {
  const response = await fetch(apiUrl(`/api/travel/trips`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("Failed to create trip");
  }

  return (await response.json()) as Trip;
}

export async function addCommentToTrip(
  tripId: string,
  message: string,
  token: string,
): Promise<Comment> {
  const response = await fetch(
    apiUrl(`/api/travel/trips/${encodeURIComponent(tripId)}/comments`),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to add comment");
  }

  return (await response.json()) as Comment;
}

export async function updateTrip(
  tripId: string,
  patch: Partial<Trip>,
  token: string,
): Promise<Trip> {
  const response = await fetch(
    apiUrl(`/api/travel/trips/${encodeURIComponent(tripId)}`),
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(patch),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to update trip");
  }

  return (await response.json()) as Trip;
}

export async function deleteTrip(tripId: string, token: string): Promise<void> {
  const response = await fetch(
    apiUrl(`/api/travel/trips/${encodeURIComponent(tripId)}`),
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to delete trip");
  }
}

export async function toggleTripLike(
  tripId: string,
  token: string,
): Promise<Trip> {
  const response = await fetch(
    apiUrl(`/api/travel/trips/${encodeURIComponent(tripId)}/like`),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to update like");
  }

  return (await response.json()) as Trip;
}
