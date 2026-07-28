export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getUsers } from "@/db/users";
import { getRequestId, internalServerError } from "@/lib/api/errors";

export async function GET(request: Request) {
  const requestId = getRequestId(request);

  try {
    const users = await getUsers();
    return NextResponse.json({ users });
  } catch {
    return internalServerError(requestId);
  }
}
