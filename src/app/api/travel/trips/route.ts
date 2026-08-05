export const runtime = "nodejs";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { appConfig } from "@/src/config/app.config";
import { createTrip, getAllTravelData } from "@/src/db/trips";
import {
  calculateTripDays,
  normalizeNotes,
  tripFormSchema,
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

    const trip = await createTrip(appConfig.defaultUserId, {
      title: result.data.title,
      city: result.data.city,
      country: result.data.country,
      startDate: result.data.startDate,
      endDate: result.data.endDate,
      days,
      approximateCost: result.data.approximateCost,
      currency: result.data.currency,
      notes: normalizeNotes(result.data.notes) ?? undefined,
      attractions: [],
      cafes: [],
    });

    revalidatePath("/");
    revalidatePath("/trips");
    revalidatePath("/me");

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
