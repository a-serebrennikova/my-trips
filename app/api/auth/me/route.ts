export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getUserById } from "@/db/users";
import { getUserTravelData } from "@/db/trips";
import { requireAuth } from "@/lib/api/auth";
import { getRequestId, internalServerError, notFound } from "@/lib/api/errors";

export async function GET(request: Request) {
  const requestId = getRequestId(request);

  try {
    const auth = requireAuth(request, requestId);
    if (!auth.ok) {
      return auth.response;
    }

    const payload = auth.payload;

    const [user, { trips }] = await Promise.all([
      getUserById(payload.userId),
      getUserTravelData(payload.userId),
    ]);

    if (!user) {
      return notFound("User not found", requestId);
    }

    return NextResponse.json({
      users: [user],
      trips,
      totalTrips: trips.length,
    });
  } catch {
    return internalServerError(requestId);
  }
}
