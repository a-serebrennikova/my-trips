export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getTripById, updateTrip, deleteTrip } from "@/src/db/trips";
import { getBearerToken, verifyAuthToken } from "@/src/lib/auth";
import type { Trip } from "@/src/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ tripId: string }> },
) {
  try {
    const { tripId } = await params;
    const trip = await getTripById(tripId);
    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }
    return NextResponse.json(trip);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ tripId: string }> },
) {
  try {
    const token = getBearerToken(request.headers.get("authorization") ?? undefined);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyAuthToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { tripId } = await params;
    const existing = await getTripById(tripId);
    if (!existing) return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    if (existing.userId !== payload.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const patch = await request.json() as Partial<Trip>;
    const updated = await updateTrip(tripId, patch);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ tripId: string }> },
) {
  try {
    const token = getBearerToken(request.headers.get("authorization") ?? undefined);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyAuthToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { tripId } = await params;
    const existing = await getTripById(tripId);
    if (!existing) return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    if (existing.userId !== payload.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await deleteTrip(tripId);
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
