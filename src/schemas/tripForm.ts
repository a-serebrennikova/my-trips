import { z } from "zod";

const MAX_TITLE_LENGTH = 124;
const MAX_CITY_LENGTH = 56;
const MAX_COUNTRY_LENGTH = 56;
const MAX_NOTES_LENGTH = 560;
const MAX_PLACE_NAME_LENGTH = 56;
const MAX_PLACE_NOTE_LENGTH = 560;
const MAX_PHOTOS_PER_PLACE = 3;
const MAX_PHOTOS_PER_TRIP = 3;
const MAX_ATTRACTIONS = 3;
const MAX_CAFES = 3;

const MS_IN_DAY = 24 * 60 * 60 * 1000;

const dateStringSchema = z
  .string()
  .min(1, "Date is required")
  .refine((value) => !Number.isNaN(new Date(value).getTime()), {
    message: "Invalid date",
  });

export const currencySchema = z.enum(["RUB", "EUR", "USD"]);

const normalizeName = (value: string) => value.trim().toLocaleLowerCase();

const assertUniqueNames = (
  items: Array<{ name: string }>,
  label: string,
  ctx: z.RefinementCtx,
) => {
  const seen = new Set<string>();

  items.forEach((item, index) => {
    const normalized = normalizeName(item.name);
    if (!normalized) return;

    if (seen.has(normalized)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [index, "name"],
        message: `${label} names must be unique`,
      });
      return;
    }

    seen.add(normalized);
  });
};

export const uploadedPhotoSchema = z
  .object({
    id: z.string().trim().min(1, "Photo id is required"),
    url: z.string().trim().url("Invalid photo URL"),
    publicId: z.string().trim().min(1, "Public id is required"),
    format: z.string().trim().min(1, "Photo format is required"),
    bytes: z.number({ error: "Photo size is required" }).int().positive(),
    width: z.number({ error: "Photo width is required" }).int().positive(),
    height: z.number({ error: "Photo height is required" }).int().positive(),
    sortOrder: z
      .number({ error: "Sort order is required" })
      .int()
      .nonnegative(),
    tripId: z.string().trim().min(1).optional(),
    placeId: z.string().trim().min(1).optional(),
  })
  .refine((photo) => !(photo.tripId && photo.placeId), {
    message: "Photo must belong to either trip or place",
    path: ["placeId"],
  });

export const tripDetailsSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(MAX_TITLE_LENGTH, `Max ${MAX_TITLE_LENGTH} characters`),
    city: z
      .string()
      .trim()
      .max(MAX_CITY_LENGTH, `Max ${MAX_CITY_LENGTH} characters`),
    country: z
      .string()
      .trim()
      .max(MAX_COUNTRY_LENGTH, `Max ${MAX_COUNTRY_LENGTH} characters`),
    startDate: dateStringSchema,
    endDate: dateStringSchema,
    approximateCost: z
      .number({ error: "Approximate cost is required" })
      .int("Only integer values are allowed")
      .nonnegative("Cost cannot be negative"),
    currency: currencySchema,
    notes: z
      .string()
      .trim()
      .max(MAX_NOTES_LENGTH, `Max ${MAX_NOTES_LENGTH} characters`)
      .optional(),
  })
  .superRefine((value, ctx) => {
    const days = calculateTripDays(value.startDate, value.endDate);
    if (days == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "End date must be the same or later than start date",
      });
    }
  });

export const placeFormSchema = z.object({
  id: z.string().trim().min(1, "Place id is required").optional(),
  name: z
    .string()
    .trim()
    .min(1, "Place name is required")
    .max(MAX_PLACE_NAME_LENGTH, `Max ${MAX_PLACE_NAME_LENGTH} characters`),
  note: z
    .string()
    .trim()
    .max(MAX_PLACE_NOTE_LENGTH, `Max ${MAX_PLACE_NOTE_LENGTH} characters`)
    .optional(),
  photos: z.array(uploadedPhotoSchema).max(MAX_PHOTOS_PER_PLACE),
  sortOrder: z.number({ error: "Sort order is required" }).int().nonnegative(),
});

export const tripStepFormSchema = tripDetailsSchema
  .extend({
    attractions: z.array(placeFormSchema).max(MAX_ATTRACTIONS),
    cafes: z.array(placeFormSchema).max(MAX_CAFES),
    tripPhotos: z.array(uploadedPhotoSchema).max(MAX_PHOTOS_PER_TRIP),
  })
  .superRefine((value, ctx) => {
    assertUniqueNames(value.attractions, "Attraction", ctx);
    assertUniqueNames(value.cafes, "Cafe", ctx);

    const days = calculateTripDays(value.startDate, value.endDate);
    if (days == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "End date must be the same or later than start date",
      });
    }
  });

export const tripFormSchema = tripDetailsSchema;

export type TripDetailsFormValues = z.infer<typeof tripDetailsSchema>;
export type UploadedPhoto = z.infer<typeof uploadedPhotoSchema>;
export type PlaceFormValues = z.infer<typeof placeFormSchema>;
export type TripStepFormValues = z.infer<typeof tripStepFormSchema>;
export type TripFormValues = z.infer<typeof tripFormSchema>;

export function validateUploadedPhotoOwnership(
  photo: UploadedPhoto,
  userId: string,
): boolean {
  try {
    const url = new URL(photo.url);
    return (
      url.hostname === "res.cloudinary.com" &&
      photo.publicId.startsWith(`trips/${userId}/`)
    );
  } catch {
    return false;
  }
}

export function normalizeNotes(value: string | undefined): string | null {
  if (value == null) return null;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

export function calculateTripDays(
  startDate: string,
  endDate: string,
): number | null {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return null;
  }

  const startUtc = Date.UTC(
    start.getUTCFullYear(),
    start.getUTCMonth(),
    start.getUTCDate(),
  );
  const endUtc = Date.UTC(
    end.getUTCFullYear(),
    end.getUTCMonth(),
    end.getUTCDate(),
  );

  if (endUtc < startUtc) {
    return null;
  }

  return Math.floor((endUtc - startUtc) / MS_IN_DAY) + 1;
}
