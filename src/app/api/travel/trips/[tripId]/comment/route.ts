export const runtime = "nodejs";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/src/auth/session";
import { createComment } from "@/src/db/trips";

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

    const { content } = await _request.json();
    const comment = await createComment(tripId, currentUserId, content);

    revalidatePath(`/trips/${tripId}`);

    return NextResponse.json({ comment });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
