export const runtime = "nodejs";

import { NextResponse } from "next/server";
import z from "zod";
import { loginUser } from "@/db/users";
import { signAuthToken } from "@/lib/auth";
import {
  badRequest,
  getRequestId,
  internalServerError,
  tooManyRequests,
  unauthorized,
} from "@/lib/api/errors";
import { consumeRateLimit, getClientIp } from "@/lib/api/rateLimit";

const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(256),
});

export async function POST(request: Request) {
  const requestId = getRequestId(request);

  try {
    const body = await request.json();
    const parsedBody = loginSchema.safeParse(body);

    if (!parsedBody.success) {
      return badRequest(
        "Invalid request body",
        requestId,
        parsedBody.error.flatten(),
      );
    }

    const email = parsedBody.data.email.toLowerCase();
    const password = parsedBody.data.password;

    const rateLimit = consumeRateLimit(
      `login:${getClientIp(request)}:${email}`,
      { windowMs: 60_000, max: 10 },
    );

    if (!rateLimit.ok) {
      return tooManyRequests(
        "Too many login attempts. Please try again later.",
        requestId,
        rateLimit.retryAfterSec,
      );
    }

    const user = await loginUser(email, password);
    if (!user) {
      return unauthorized("Invalid email or password", requestId);
    }

    const token = signAuthToken({ userId: user.id, email: user.email });
    return NextResponse.json({ user, token });
  } catch {
    return internalServerError(requestId);
  }
}
