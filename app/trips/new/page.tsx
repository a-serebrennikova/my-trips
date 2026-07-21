"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageLayout } from "@/components/layout/PageLayout";
import { createTrip } from "../../../store/travelApi";
import { useAuthStore } from "../../../store/authStore";

const tripSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    city: z.string().min(2, "Please enter a city"),
    country: z.string().min(2, "Please enter a country"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    days: z.string().min(1, "Please enter number of days"),
    approximateCost: z.string().min(1, "Please enter estimated cost"),
    currency: z.enum(["₽", "€", "$"]),
    rating: z.string().min(1, "Please provide a rating"),
    notes: z.string().max(1000, "Maximum 1000 characters"),
    attractionsRaw: z.string().max(1000, "Maximum 1000 characters"),
    cafesRaw: z.string().max(1000, "Maximum 1000 characters"),
    coverImage: z.string().or(z.literal("")),
  })
  .refine(
    (data) =>
      new Date(data.endDate).getTime() >= new Date(data.startDate).getTime(),
    {
      message: "End date cannot be earlier than start date",
      path: ["endDate"],
    },
  );

type TripFormValues = z.infer<typeof tripSchema>;

export default function NewTripPage() {
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.currentUser);
  const authToken = useAuthStore((state) => state.authToken);

  useEffect(() => {
    if (!currentUser) {
      router.replace("/login");
    }
  }, [currentUser, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TripFormValues>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      title: "",
      city: "",
      country: "",
      startDate: "",
      endDate: "",
      days: "",
      approximateCost: "",
      currency: "₽",
      rating: "5",
      notes: "",
      attractionsRaw: "",
      cafesRaw: "",
      coverImage: "",
    },
  });

  if (!currentUser) {
    return null;
  }

  const parsePlaces = (raw?: string) => {
    if (!raw) return [];
    return raw
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, index) => {
        const [name, note] = line.split("—");
        return {
          id: `p-${index}-${Date.now()}`,
          name: name.trim(),
          city: "",
          note: note?.trim(),
        };
      });
  };

  const onSubmit = async (values: TripFormValues) => {
    const attractions = parsePlaces(values.attractionsRaw);
    const cafes = parsePlaces(values.cafesRaw);

    // Convert string values to numbers
    const days = Number(values.days);
    const rating = Number(values.rating);
    const approximateCost = Number(values.approximateCost.replace(/\s/g, ""));

    // Validate converted values
    if (!Number.isInteger(days) || days <= 0) {
      throw new Error("Number of days must be a positive integer");
    }
    if (rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }
    if (approximateCost <= 0) {
      throw new Error("Cost must be a positive number");
    }

    if (!authToken) {
      router.push("/login");
      return;
    }

    await createTrip(
      {
        title: values.title,
        city: values.city,
        country: values.country,
        startDate: values.startDate,
        endDate: values.endDate,
        days,
        approximateCost,
        currency: values.currency,
        rating,
        coverImage: values.coverImage?.trim() ?? "",
        notes: values.notes.trim() || undefined,
        attractions,
        cafes,
        comments: [],
      },
      authToken,
    );

    router.push("/trips");
  };

  return (
    <PageLayout>
      <div className="glass-card space-y-5 p-6 sm:p-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-xs font-medium text-sky-700 hover:text-sky-600"
        >
          ← Back
        </button>

        <header className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
            New Trip
          </h1>
          <p className="text-sm text-slate-600">
            Add city, dates, estimated budget, and your favorite places.
          </p>
        </header>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-5 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">
                Trip title
              </label>
              <input
                type="text"
                className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-3 py-2 text-sm text-slate-800 outline-none ring-sky-400 focus:bg-white focus:ring-2"
                placeholder="Spring in Istanbul"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-[11px] text-rose-500">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">
                  City
                </label>
                <input
                  type="text"
                  className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-3 py-2 text-sm text-slate-800 outline-none ring-sky-400 focus:bg-white focus:ring-2"
                  placeholder="Istanbul"
                  {...register("city")}
                />
                {errors.city && (
                  <p className="text-[11px] text-rose-500">
                    {errors.city.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">
                  Country
                </label>
                <input
                  type="text"
                  className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-3 py-2 text-sm text-slate-800 outline-none ring-sky-400 focus:bg-white focus:ring-2"
                  placeholder="Turkey"
                  {...register("country")}
                />
                {errors.country && (
                  <p className="text-[11px] text-rose-500">
                    {errors.country.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">
                  Start date
                </label>
                <input
                  type="date"
                  className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-3 py-2 text-sm text-slate-800 outline-none ring-sky-400 focus:bg-white focus:ring-2"
                  {...register("startDate")}
                />
                {errors.startDate && (
                  <p className="text-[11px] text-rose-500">
                    {errors.startDate.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">
                  End date
                </label>
                <input
                  type="date"
                  className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-3 py-2 text-sm text-slate-800 outline-none ring-sky-400 focus:bg-white focus:ring-2"
                  {...register("endDate")}
                />
                {errors.endDate && (
                  <p className="text-[11px] text-rose-500">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">
                Notes and impressions
              </label>
              <textarea
                rows={5}
                className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-3 py-2 text-sm text-slate-800 outline-none ring-sky-400 focus:bg-white focus:ring-2"
                placeholder="What you liked, emotions, route tips..."
                {...register("notes")}
              />
              {errors.notes && (
                <p className="text-[11px] text-rose-500">
                  {errors.notes.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">
                  Number of days
                </label>
                <input
                  type="number"
                  min={1}
                  className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-3 py-2 text-sm text-slate-800 outline-none ring-sky-400 focus:bg-white focus:ring-2"
                  {...register("days")}
                />
                {errors.days && (
                  <p className="text-[11px] text-rose-500">
                    {errors.days.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">
                  Estimated cost
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-3 py-2 text-sm text-slate-800 outline-none ring-sky-400 focus:bg-white focus:ring-2"
                    placeholder="88000"
                    {...register("approximateCost")}
                  />
                  <select
                    className="w-16 rounded-2xl border border-sky-100 bg-sky-50/60 px-2 py-2 text-sm text-slate-800 outline-none ring-sky-400 focus:bg-white focus:ring-2"
                    {...register("currency")}
                  >
                    <option value="₽">₽</option>
                    <option value="€">€</option>
                    <option value="$">$</option>
                  </select>
                </div>
                {errors.approximateCost && (
                  <p className="text-[11px] text-rose-500">
                    {errors.approximateCost.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">
                Trip rating
              </label>
              <select
                className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-3 py-2 text-sm text-slate-800 outline-none ring-sky-400 focus:bg-white focus:ring-2"
                {...register("rating")}
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
              {errors.rating && (
                <p className="text-[11px] text-rose-500">
                  {errors.rating.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">
                Attractions
              </label>
              <textarea
                rows={4}
                className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-3 py-2 text-xs text-slate-800 outline-none ring-sky-400 focus:bg-white focus:ring-2"
                placeholder={
                  "Blue Mosque — better to come at opening\nGalata Tower — perfect at sunset"
                }
                {...register("attractionsRaw")}
              />
              {errors.attractionsRaw && (
                <p className="text-[11px] text-rose-500">
                  {errors.attractionsRaw.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">
                Cafes and restaurants
              </label>
              <textarea
                rows={4}
                className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-3 py-2 text-xs text-slate-800 outline-none ring-sky-400 focus:bg-white focus:ring-2"
                placeholder={
                  "Cafe Privato — breakfast with a view of Galata Bridge"
                }
                {...register("cafesRaw")}
              />
              {errors.cafesRaw && (
                <p className="text-[11px] text-rose-500">
                  {errors.cafesRaw.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700">
                Cover image URL (optional)
              </label>
              <input
                type="url"
                className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-3 py-2 text-sm text-slate-800 outline-none ring-sky-400 focus:bg-white focus:ring-2"
                placeholder="https://..."
                {...register("coverImage")}
              />
              {errors.coverImage && (
                <p className="text-[11px] text-rose-500">
                  {errors.coverImage.message}
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-amber-400 px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-md shadow-amber-400/40 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-amber-200"
              >
                Save trip
              </button>
            </div>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}
