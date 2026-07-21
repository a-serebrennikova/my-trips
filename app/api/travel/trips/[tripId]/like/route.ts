export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { toggleTripLike } from "@/db/trips";
import { getBearerToken, verifyAuthToken } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ tripId: string }> },
) {
  try {
    const token = getBearerToken(
      request.headers.get("authorization") ?? undefined,
    );
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyAuthToken(token);
    if (!payload)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { tripId } = await params;
    const trip = await toggleTripLike(tripId, payload.userId);
    if (!trip)
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });

    return NextResponse.json(trip);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
