export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { getAllTravelData } from "@/src/db/trips";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit") ?? "10");
    const offset = Number(searchParams.get("offset") ?? "0");

    const data = await getAllTravelData(limit, offset);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
