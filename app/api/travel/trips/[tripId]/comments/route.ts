export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createComment } from "@/src/db/trips";
import { getBearerToken, verifyAuthToken } from "@/src/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ tripId: string }> },
) {
  try {
    const token = getBearerToken(request.headers.get("authorization") ?? undefined);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyAuthToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { tripId } = await params;
    const body = await request.json() as { message?: string };

    if (!body.message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const comment = await createComment(tripId, payload.userId, body.message);
    return NextResponse.json(comment, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
