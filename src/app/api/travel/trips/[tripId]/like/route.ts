export const runtime = "nodejs";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { toggleTripLike } from "@/src/db/trips";
import { getCurrentUserId } from "@/src/auth/session";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ tripId: string }> },
) {
  try {
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tripId } = await params;

    const likedByUserIds = await toggleTripLike(tripId, currentUserId);

    revalidatePath(`/trips/${tripId}`);

    return NextResponse.json({ likedByUserIds });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
