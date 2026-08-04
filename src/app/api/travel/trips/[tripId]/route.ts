export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { getTripById } from "@/src/db/trips";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ tripId: string }> },
) {
  try {
    const { tripId } = await params;
    const trip = await getTripById(tripId);
    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }
    return NextResponse.json(trip);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
