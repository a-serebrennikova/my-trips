export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getUserById } from "@/db/users";
import { getUserTravelData } from "@/db/trips";
import { getBearerToken, verifyAuthToken } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const token = getBearerToken(
      request.headers.get("authorization") ?? undefined,
    );
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyAuthToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const [user, { trips }] = await Promise.all([
      getUserById(payload.userId),
      getUserTravelData(payload.userId),
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      users: [user],
      trips,
      totalTrips: trips.length,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
