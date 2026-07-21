export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getAllTravelData, createTrip } from "@/src/db/trips";
import { getBearerToken, verifyAuthToken } from "@/src/lib/auth";
import type { Trip } from "@/src/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit") ?? "10");
    const offset = Number(searchParams.get("offset") ?? "0");

    const data = await getAllTravelData(limit, offset);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const token = getBearerToken(request.headers.get("authorization") ?? undefined);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyAuthToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await request.json() as Omit<Trip, "id" | "userId" | "createdAt" | "likedByUserIds">;
    const trip = await createTrip(payload.userId, body);
    return NextResponse.json(trip, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
