import { prisma } from "./db";
import type { User, Trip, Comment, Place } from "./travelStore";

function mapDbTripToTrip(db: {
  id: string;
  userId: string;
  title: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  days: number;
  approximateCost: number;
  currency: string;
  rating: number;
  coverImage: string;
  notes: string | null;
  createdAt: string;
  places: {
    id: string;
    name: string;
    city: string;
    note: string | null;
    type: string;
  }[];
  comments: {
    id: string;
    tripId: string;
    authorId: string;
    message: string;
    createdAt: string;
  }[];
  likes: { userId: string }[];
}): Trip {
  const attractions: Place[] = db.places
    .filter((p) => p.type === "attraction")
    .map((p) => ({
      id: p.id,
      name: p.name,
      city: p.city,
      note: p.note ?? undefined,
    }));
  const cafes: Place[] = db.places
    .filter((p) => p.type === "cafe")
    .map((p) => ({
      id: p.id,
      name: p.name,
      city: p.city,
      note: p.note ?? undefined,
    }));
  const comments: Comment[] = db.comments.map((c) => ({
    id: c.id,
    tripId: c.tripId,
    authorId: c.authorId,
    message: c.message,
    createdAt: c.createdAt,
  }));
  const likedByUserIds = db.likes.map((l) => l.userId);

  return {
    id: db.id,
    userId: db.userId,
    title: db.title,
    city: db.city,
    country: db.country,
    startDate: db.startDate,
    endDate: db.endDate,
    days: db.days,
    approximateCost: db.approximateCost,
    currency: db.currency as "₽" | "€" | "$",
    rating: db.rating,
    coverImage: db.coverImage,
    notes: db.notes ?? undefined,
    attractions,
    cafes,
    createdAt: db.createdAt,
    likedByUserIds,
    comments,
  };
}

function mapDbUserToUser(db: {
  id: string;
  name: string;
  email: string;
  password: string;
  avatarColor: string;
  homeCity: string;
}): User {
  return {
    id: db.id,
    name: db.name,
    email: db.email,
    password: db.password,
    avatarColor: db.avatarColor,
    homeCity: db.homeCity,
  };
}

export async function getUserTravelData(
  userId: string,
): Promise<{ trips: Trip[] }> {
  const dbTrips = await prisma.trip.findMany({
    where: { userId },
    include: { places: true, comments: true, likes: true },
    orderBy: { createdAt: "desc" },
  });
  return {
    trips: dbTrips.map(mapDbTripToTrip),
  };
}

export async function getAllTravelData(
  limit: number = 10,
  offset: number = 0,
): Promise<{
  users: User[];
  trips: Trip[];
  totalTrips: number;
}> {
  const [users, dbTrips, totalTrips] = await Promise.all([
    prisma.user.findMany(),
    prisma.trip.findMany({
      skip: offset,
      take: limit,
      include: { places: true, comments: true, likes: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.trip.count(),
  ]);
  return {
    users: users.map(mapDbUserToUser),
    trips: dbTrips.map(mapDbTripToTrip),
    totalTrips,
  };
}

export async function getTripById(tripId: string): Promise<Trip | undefined> {
  const db = await prisma.trip.findUnique({
    where: { id: tripId },
    include: { places: true, comments: true, likes: true },
  });
  return db ? mapDbTripToTrip(db) : undefined;
}

export async function getUserById(userId: string): Promise<User | undefined> {
  const db = await prisma.user.findUnique({
    where: { id: userId },
  });
  return db ? mapDbUserToUser(db) : undefined;
}

export async function createTrip(
  input: Omit<Trip, "id" | "createdAt" | "likedByUserIds">,
): Promise<Trip> {
  const cityFallback = input.city;
  const attractions = input.attractions.map((p) => ({
    id: p.id,
    name: p.name,
    city: p.city || cityFallback,
    note: p.note,
    type: "attraction" as const,
  }));
  const cafes = input.cafes.map((p) => ({
    id: p.id,
    name: p.name,
    city: p.city || cityFallback,
    note: p.note,
    type: "cafe" as const,
  }));

  const db = await prisma.trip.create({
    data: {
      userId: input.userId,
      title: input.title,
      city: input.city,
      country: input.country,
      startDate: input.startDate,
      endDate: input.endDate,
      days: input.days,
      approximateCost: input.approximateCost,
      currency: input.currency,
      rating: input.rating,
      coverImage: input.coverImage,
      notes: input.notes,
      createdAt: new Date().toISOString(),
      places: {
        create: [...attractions, ...cafes],
      },
    },
    include: { places: true, comments: true, likes: true },
  });

  return mapDbTripToTrip(db);
}

export async function updateTrip(
  tripId: string,
  patch: Partial<Trip>,
): Promise<Trip | null> {
  // Проверяем, существует ли поездка
  const existing = await prisma.trip.findUnique({
    where: { id: tripId },
    select: { id: true }, // Выбираем только ID для проверки существования
  });

  if (!existing) return null;
  const updateData: Record<string, unknown> = {};
  if (patch.title != null) updateData.title = patch.title;
  if (patch.city != null) updateData.city = patch.city;
  if (patch.country != null) updateData.country = patch.country;
  if (patch.startDate != null) updateData.startDate = patch.startDate;
  if (patch.endDate != null) updateData.endDate = patch.endDate;
  if (patch.days != null) updateData.days = patch.days;
  if (patch.approximateCost != null)
    updateData.approximateCost = patch.approximateCost;
  if (patch.currency != null) updateData.currency = patch.currency;
  if (patch.rating != null) updateData.rating = patch.rating;
  if (patch.coverImage != null) updateData.coverImage = patch.coverImage;
  if (patch.notes != null) updateData.notes = patch.notes;

  // Если обновляются места, то сначала удаляем старые и создаем новые
  if (patch.attractions != null || patch.cafes != null) {
    await prisma.place.deleteMany({ where: { tripId } });

    const attractions =
      patch.attractions?.map((p) => ({
        id: p.id,
        name: p.name,
        city: p.city || patch.city || "",
        note: p.note,
        type: "attraction" as const,
      })) || [];

    const cafes =
      patch.cafes?.map((p) => ({
        id: p.id,
        name: p.name,
        city: p.city || patch.city || "",
        note: p.note,
        type: "cafe" as const,
      })) || [];

    await prisma.place.createMany({
      data: [...attractions, ...cafes].map((p) => ({
        id: p.id,
        name: p.name,
        city: p.city,
        note: p.note,
        tripId,
        type: p.type,
      })),
    });
  }

  const db = await prisma.trip.update({
    where: { id: tripId },
    data: updateData,
    include: { places: true, comments: true, likes: true },
  });

  if (!db) return null;

  return mapDbTripToTrip(db);
}

export async function deleteTrip(tripId: string): Promise<boolean> {
  const result = await prisma.trip.deleteMany({
    where: { id: tripId },
  });
  return result.count > 0;
}

export async function createComment(
  tripId: string,
  authorId: string,
  message: string,
): Promise<Comment> {
  const db = await prisma.comment.create({
    data: {
      tripId,
      authorId,
      message: message.trim(),
      createdAt: new Date().toISOString(),
    },
  });
  return {
    id: db.id,
    tripId: db.tripId,
    authorId: db.authorId,
    message: db.message,
    createdAt: db.createdAt,
  };
}

export async function toggleTripLike(
  tripId: string,
  userId: string,
): Promise<Trip | undefined> {
  const existing = await prisma.tripLike.findUnique({
    where: { tripId_userId: { tripId, userId } },
  });

  if (existing) {
    await prisma.tripLike.delete({
      where: { tripId_userId: { tripId, userId } },
    });
  } else {
    await prisma.tripLike.create({
      data: { tripId, userId },
    });
  }

  const db = await prisma.trip.findUnique({
    where: { id: tripId },
    include: { places: true, comments: true, likes: true },
  });
  return db ? mapDbTripToTrip(db) : undefined;
}
