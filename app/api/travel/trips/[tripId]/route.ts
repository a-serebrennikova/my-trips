export const runtime = "nodejs";

import { NextResponse } from "next/server";
import z from "zod";
import { getTripById, updateTrip, deleteTrip } from "@/db/trips";
import { requireAuth } from "@/lib/api/auth";
import {
  badRequest,
  forbidden,
  getRequestId,
  internalServerError,
  notFound,
} from "@/lib/api/errors";

const placeSchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1).max(140),
  city: z.string().trim().max(140),
  note: z.string().trim().max(800).optional(),
});

const tripPatchSchema = z
  .object({
    title: z.string().trim().min(3).max(160).optional(),
    city: z.string().trim().min(2).max(120).optional(),
    country: z.string().trim().min(2).max(120).optional(),
    startDate: z.string().trim().min(1).optional(),
    endDate: z.string().trim().min(1).optional(),
    days: z.number().int().min(1).max(3650).optional(),
    approximateCost: z.number().min(0).optional(),
    currency: z.enum(["RUB", "EUR", "USD", "₽", "€", "$"]).optional(),
    rating: z.number().int().min(1).max(5).optional(),
    coverImage: z.string().trim().max(2048).optional(),
    notes: z.string().trim().max(4000).optional(),
    attractions: z.array(placeSchema).optional(),
    cafes: z.array(placeSchema).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

export async function GET(
  request: Request,
  { params }: { params: Promise<{ tripId: string }> },
) {
  const requestId = getRequestId(request);

  try {
    const { tripId } = await params;
    const trip = await getTripById(tripId);
    if (!trip) {
      return notFound("Trip not found", requestId);
    }
    return NextResponse.json(trip);
  } catch {
    return internalServerError(requestId);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ tripId: string }> },
) {
  const requestId = getRequestId(request);

  try {
    const auth = requireAuth(request, requestId);
    if (!auth.ok) {
      return auth.response;
    }
    const payload = auth.payload;

    const { tripId } = await params;
    const existing = await getTripById(tripId);
    if (!existing) return notFound("Trip not found", requestId);
    if (existing.userId !== payload.userId) {
      return forbidden("Forbidden", requestId);
    }

    const body = await request.json();
    const parsedPatch = tripPatchSchema.safeParse(body);

    if (!parsedPatch.success) {
      return badRequest(
        "Invalid request body",
        requestId,
        parsedPatch.error.flatten(),
      );
    }

    const updated = await updateTrip(tripId, parsedPatch.data);
    return NextResponse.json(updated);
  } catch {
    return internalServerError(requestId);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ tripId: string }> },
) {
  const requestId = getRequestId(request);

  try {
    const auth = requireAuth(request, requestId);
    if (!auth.ok) {
      return auth.response;
    }
    const payload = auth.payload;

    const { tripId } = await params;
    const existing = await getTripById(tripId);
    if (!existing) return notFound("Trip not found", requestId);
    if (existing.userId !== payload.userId) {
      return forbidden("Forbidden", requestId);
    }

    await deleteTrip(tripId);
    return new NextResponse(null, { status: 204 });
  } catch {
    return internalServerError(requestId);
  }
}
