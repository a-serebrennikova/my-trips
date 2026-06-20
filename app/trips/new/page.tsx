"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTrip } from "../../../lib/travelApi";
import { useAuthStore } from "../../../lib/authStore";

const tripSchema = z
  .object({
    title: z.string().min(3, "Название минимум 3 символа"),
    city: z.string().min(2, "Укажите город"),
    country: z.string().min(2, "Укажите страну"),
    startDate: z.string().min(1, "Дата начала обязательна"),
    endDate: z.string().min(1, "Дата окончания обязательна"),
    days: z.string().min(1, "Укажите количество дней"),
    approximateCost: z.string().min(1, "Укажите примерную стоимость"),
    currency: z.enum(["₽", "€", "$"]),
    rating: z.string().min(1, "Укажите оценку"),
    notes: z.string().max(1000, "Максимум 1000 символов"),
    attractionsRaw: z.string().max(1000, "Максимум 1000 символов"),
    cafesRaw: z.string().max(1000, "Максимум 1000 символов"),
    coverImage: z.string().or(z.literal("")),
  })
  .refine(
    (data) =>
      new Date(data.endDate).getTime() >= new Date(data.startDate).getTime(),
    {
      message: "Дата окончания не может быть раньше начала",
      path: ["endDate"],
    },
  );

type TripFormValues = z.infer<typeof tripSchema>;

export default function NewTripPage() {
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.currentUser);

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
    router.push("/login");
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
      throw new Error("Количество дней должно быть положительным числом");
    }
    if (rating < 1 || rating > 5) {
      throw new Error("Оценка должна быть от 1 до 5");
    }
    if (approximateCost <= 0) {
      throw new Error("Стоимость должна быть положительным числом");
    }

    await createTrip({
      userId: currentUser.id,
      title: values.title,
      city: values.city,
      country: values.country,
      startDate: values.startDate,
      endDate: values.endDate,
      days,
      approximateCost,
      currency: values.currency,
      rating,
      coverImage:
        values.coverImage && values.coverImage.length > 0
          ? values.coverImage
          : "https://era74.ru/media/catalog/2019/08/06/no-photo_94BoRIW.png",
      notes: values.notes.trim() || undefined,
      attractions,
      cafes,
      comments: [],
    });

    router.push("/trips");
  };

  return (
    <div className="glass-card space-y-5 bg-white/95 p-6 sm:p-8">
      <button
        type="button"
        onClick={() => router.back()}
        className="text-xs font-medium text-sky-700 hover:text-sky-600"
      >
        ← Назад
      </button>

      <header className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
          Новое путешествие
        </h1>
        <p className="text-sm text-slate-600">
          Расскажите о городе, датах, примерном бюджете и любимых местах.
        </p>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-5 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-700">
              Название поездки
            </label>
            <input
              type="text"
              className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-3 py-2 text-sm text-slate-800 outline-none ring-sky-400 focus:bg-white focus:ring-2"
              placeholder="Весенний Стамбул"
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
                Город
              </label>
              <input
                type="text"
                className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-3 py-2 text-sm text-slate-800 outline-none ring-sky-400 focus:bg-white focus:ring-2"
                placeholder="Стамбул"
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
                Страна
              </label>
              <input
                type="text"
                className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-3 py-2 text-sm text-slate-800 outline-none ring-sky-400 focus:bg-white focus:ring-2"
                placeholder="Турция"
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
                Дата начала
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
                Дата окончания
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
              Впечатления и заметки
            </label>
            <textarea
              rows={5}
              className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-3 py-2 text-sm text-slate-800 outline-none ring-sky-400 focus:bg-white focus:ring-2"
              placeholder="Что понравилось, какие эмоции, советы по маршруту..."
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
                Количество дней
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
                Примерная стоимость
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
              Оценка поездки
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
              Достопримечательности
            </label>
            <textarea
              rows={4}
              className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-3 py-2 text-xs text-slate-800 outline-none ring-sky-400 focus:bg-white focus:ring-2"
              placeholder={
                "Голубая мечеть — лучше приходить к открытию\nГалатская башня — идеальный закат"
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
              Кафе и рестораны
            </label>
            <textarea
              rows={4}
              className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-3 py-2 text-xs text-slate-800 outline-none ring-sky-400 focus:bg-white focus:ring-2"
              placeholder={"Cafe Privato — завтрак с видом на Галатский мост"}
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
              Обложка (URL картинки, необязательно)
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
              Сохранить путешествие
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
