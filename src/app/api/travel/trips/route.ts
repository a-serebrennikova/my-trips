export const runtime = "nodejs";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { createTrip, getAllTravelData } from "@/src/db/trips";
import { getCurrentUserId } from "@/src/auth/session";
import {
  calculateTripDays,
  normalizeNotes,
  tripStepFormSchema,
  validateUploadedPhotoOwnership,
} from "@/src/schemas/tripForm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit") ?? "10");
    const offset = Number(searchParams.get("offset") ?? "0");

    const data = await getAllTravelData(limit, offset);
    return NextResponse.json(data);
  } catch (error) {
    console.error("[GET /api/travel/trips]", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        ...(process.env.NODE_ENV !== "production" &&
          error instanceof Error && { details: error.message }),
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = tripStepFormSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: result.error.flatten(),
        },
        { status: 400 },
      );
    }

    const photos = [
      ...result.data.tripPhotos,
      ...result.data.attractions.flatMap((place) => place.photos),
      ...result.data.cafes.flatMap((place) => place.photos),
    ];
    if (
      photos.some(
        (photo) => !validateUploadedPhotoOwnership(photo, currentUserId),
      )
    ) {
      return NextResponse.json(
        { error: "Invalid photo ownership" },
        { status: 400 },
      );
    }

    const days = calculateTripDays(result.data.startDate, result.data.endDate);
    if (days == null) {
      return NextResponse.json(
        { error: "Invalid date range" },
        { status: 400 },
      );
    }

    const trip = await createTrip(currentUserId, {
      title: result.data.title,
      city: result.data.city,
      country: result.data.country,
      startDate: result.data.startDate,
      endDate: result.data.endDate,
      days,
      approximateCost: result.data.approximateCost,
      currency: result.data.currency,
      notes: normalizeNotes(result.data.notes) ?? undefined,
      attractions: result.data.attractions,
      cafes: result.data.cafes,
      tripPhotos: result.data.tripPhotos,
    });

    revalidatePath("/");
    revalidatePath("/trips");
    revalidatePath("/me");
    revalidateTag("all-travel-data", "default");
    revalidateTag("trip-by-id", "default");

    return NextResponse.json(trip, { status: 201 });
  } catch (error) {
    console.error("[POST /api/travel/trips]", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        ...(process.env.NODE_ENV !== "production" &&
          error instanceof Error && { details: error.message }),
      },
      { status: 500 },
    );
  }
}
