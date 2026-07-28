export const runtime = "nodejs";

import { NextResponse } from "next/server";
import z from "zod";
import { getAllTravelData, createTrip } from "@/db/trips";
import { requireAuth } from "@/lib/api/auth";
import {
  badRequest,
  getRequestId,
  internalServerError,
} from "@/lib/api/errors";
import type { Trip } from "@/types";

const paginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(10),
  offset: z.coerce.number().int().min(0).max(100000).default(0),
});

const placeSchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1).max(140),
  city: z.string().trim().max(140),
  note: z.string().trim().max(800).optional(),
});

const tripCreateSchema = z
  .object({
    title: z.string().trim().min(3).max(160),
    city: z.string().trim().min(2).max(120),
    country: z.string().trim().min(2).max(120),
    startDate: z.string().trim().min(1),
    endDate: z.string().trim().min(1),
    days: z.number().int().min(1).max(3650),
    approximateCost: z.number().min(0),
    currency: z.enum(["RUB", "EUR", "USD", "₽", "€", "$"]),
    rating: z.number().int().min(1).max(5),
    coverImage: z.string().trim().max(2048).optional().default(""),
    notes: z.string().trim().max(4000).optional(),
    attractions: z.array(placeSchema).default([]),
    cafes: z.array(placeSchema).default([]),
  })
  .refine(
    (value) =>
      new Date(value.endDate).getTime() >= new Date(value.startDate).getTime(),
    {
      message: "endDate cannot be earlier than startDate",
      path: ["endDate"],
    },
  );

export async function GET(request: Request) {
  const requestId = getRequestId(request);

  try {
    const { searchParams } = new URL(request.url);
    const parsedPagination = paginationSchema.safeParse({
      limit: searchParams.get("limit") ?? undefined,
      offset: searchParams.get("offset") ?? undefined,
    });

    if (!parsedPagination.success) {
      return badRequest(
        "Invalid pagination params",
        requestId,
        parsedPagination.error.flatten(),
      );
    }

    const { limit, offset } = parsedPagination.data;

    const data = await getAllTravelData(limit, offset);
    return NextResponse.json(data);
  } catch {
    return internalServerError(requestId);
  }
}

export async function POST(request: Request) {
  const requestId = getRequestId(request);

  try {
    const auth = requireAuth(request, requestId);
    if (!auth.ok) {
      return auth.response;
    }
    const payload = auth.payload;

    const body = await request.json();
    const parsedBody = tripCreateSchema.safeParse(body);

    if (!parsedBody.success) {
      return badRequest(
        "Invalid request body",
        requestId,
        parsedBody.error.flatten(),
      );
    }

    const tripInput: Omit<
      Trip,
      "id" | "userId" | "createdAt" | "likedByUserIds"
    > = {
      ...parsedBody.data,
      comments: [],
    };

    const trip = await createTrip(payload.userId, tripInput);
    return NextResponse.json(trip, { status: 201 });
  } catch {
    return internalServerError(requestId);
  }
}
