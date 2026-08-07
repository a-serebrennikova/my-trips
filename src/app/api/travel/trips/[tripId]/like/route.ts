export const runtime = "nodejs";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { toggleTripLike } from "@/src/db/trips";
import { appConfig } from "@/src/config/app.config";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ tripId: string }> },
) {
  try {
    const { tripId } = await params;

    const likedByUserIds = await toggleTripLike(tripId, appConfig.defaultUserId);

    revalidatePath(`/trips/${tripId}`);

    return NextResponse.json({ likedByUserIds });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
