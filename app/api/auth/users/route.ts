export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getUsers } from "@/db/users";

export async function GET() {
  try {
    const users = await getUsers();
    return NextResponse.json({ users });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
