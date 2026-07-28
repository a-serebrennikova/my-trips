export const runtime = "nodejs";

import { NextResponse } from "next/server";
import z from "zod";
import { createComment, getTripById } from "@/db/trips";
import { requireAuth } from "@/lib/api/auth";
import {
  badRequest,
  getRequestId,
  internalServerError,
  notFound,
} from "@/lib/api/errors";

const commentSchema = z.object({
  message: z.string().trim().min(1).max(400),
});

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
    const trip = await getTripById(tripId);
    if (!trip) return notFound("Trip not found", requestId);

    const body = await request.json();
    const parsedBody = commentSchema.safeParse(body);

    if (!parsedBody.success) {
      return badRequest(
        "Invalid request body",
        requestId,
        parsedBody.error.flatten(),
      );
    }

    const comment = await createComment(
      tripId,
      payload.userId,
      parsedBody.data.message,
    );
    return NextResponse.json(comment, { status: 201 });
  } catch {
    return internalServerError(requestId);
  }
}
