import { z } from "zod";

const MAX_TITLE_LENGTH = 124;
const MAX_CITY_LENGTH = 56;
const MAX_COUNTRY_LENGTH = 56;
const MAX_NOTES_LENGTH = 560;

const MS_IN_DAY = 24 * 60 * 60 * 1000;

const dateStringSchema = z
  .string()
  .min(1, "Date is required")
  .refine((value) => !Number.isNaN(new Date(value).getTime()), {
    message: "Invalid date",
  });

export const currencySchema = z.enum(["RUB", "EUR", "USD"]);

export const tripFormSchema = z
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

export type TripFormValues = z.infer<typeof tripFormSchema>;

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
