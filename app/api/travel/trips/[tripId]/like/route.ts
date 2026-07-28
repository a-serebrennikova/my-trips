export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getTripById, toggleTripLike } from "@/db/trips";
import { requireAuth } from "@/lib/api/auth";
import { getRequestId, internalServerError, notFound } from "@/lib/api/errors";

export async function POST(
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
    const existingTrip = await getTripById(tripId);
    if (!existingTrip) return notFound("Trip not found", requestId);

    const trip = await toggleTripLike(tripId, payload.userId);
    if (!trip) return notFound("Trip not found", requestId);

    return NextResponse.json(trip);
  } catch {
    return internalServerError(requestId);
  }
}
