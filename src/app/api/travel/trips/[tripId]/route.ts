export const runtime = "nodejs";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { appConfig } from "@/src/config/app.config";
import { deleteTrip, getTripById, updateTrip } from "@/src/db/trips";
import {
  calculateTripDays,
  normalizeNotes,
  tripFormSchema,
} from "@/src/schemas/tripForm";

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
  } catch (error) {
    console.error("[GET /api/travel/trips/[tripId]]", error);
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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ tripId: string }> },
) {
  try {
    const { tripId } = await params;

    const existingTrip = await getTripById(tripId);
    if (!existingTrip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    if (existingTrip.userId !== appConfig.defaultUserId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const result = tripFormSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: result.error.flatten(),
        },
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

    const updatedTrip = await updateTrip(tripId, {
      title: result.data.title,
      city: result.data.city,
      country: result.data.country,
      startDate: result.data.startDate,
      endDate: result.data.endDate,
      days,
      approximateCost: result.data.approximateCost,
      currency: result.data.currency,
      notes: normalizeNotes(result.data.notes) ?? undefined,
    });

    if (!updatedTrip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    revalidatePath("/");
    revalidatePath("/trips");
    revalidatePath(`/trips/${tripId}`);
    revalidatePath("/me");

    return NextResponse.json(updatedTrip);
  } catch (error) {
    console.error("[PATCH /api/travel/trips/[tripId]]", error);
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

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ tripId: string }> },
) {
  try {
    const { tripId } = await params;

    const existingTrip = await getTripById(tripId);
    if (!existingTrip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    if (existingTrip.userId !== appConfig.defaultUserId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const deleted = await deleteTrip(tripId);
    if (!deleted) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    revalidatePath("/");
    revalidatePath("/trips");
    revalidatePath("/friends");
    revalidatePath(`/friends/${existingTrip.userId}`);
    revalidatePath("/me");

    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("[DELETE /api/travel/trips/[tripId]]", error);
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
