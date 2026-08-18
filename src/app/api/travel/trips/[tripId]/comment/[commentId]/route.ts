export const runtime = "nodejs";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/src/auth/session";
import { deleteComment } from "@/src/db/trips";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ tripId: string; commentId: string }> },
) {
  try {
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tripId, commentId } = await params;
    const deleted = await deleteComment(tripId, commentId, currentUserId);

    if (!deleted) {
      return NextResponse.json(
        { error: "Comment not found or access denied" },
        { status: 404 },
      );
    }

    revalidatePath(`/trips/${tripId}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete comment error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
