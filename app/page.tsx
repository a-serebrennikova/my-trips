// import { useRouter } from "next/navigation";
import { TripCard } from "../components/trip/TripCard";
import type { Trip, User } from "../lib/travelStore";
import { fetchTravelData, toggleTripLike } from "../lib/travelApi";
import { useAuthStore } from "../lib/authStore";
import { Button } from "@radix-ui/themes/components/button";
import Link from "next/link";
import { RedirectLink } from "@/components/main/RedirectLink";

export default async function Home() {
  const snapshot = await fetchTravelData(3, 0); // Загружаем только 3 последние поездки
  const { users, trips } = snapshot;

  const topTrips = trips;

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-stretch">
      <section className="glass-card flex flex-col justify-between bg-gradient-to-br from-sky-50 via-white to-sky-50/80 p-6 sm:p-8">
        <div className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">
            ЛИЧНЫЙ ДНЕВНИК ПУТЕШЕСТВИЙ
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Тут собираются твои{" "}
            <span className="text-sky-600">лучшие поездки</span>.
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Добавляй города, впечатления, любимые кафе и делись ими с друзьями.
            Каждый трип — это отдельная история с оценкой, заметками и
            комментариями.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <RedirectLink />
            <Link
              href="/trips"
              className="inline-flex items-center justify-center rounded-full border border-sky-200 bg-white/70 px-4 py-2 text-xs font-semibold text-sky-700 hover:bg-sky-50"
            >
              Смотреть все поездки
            </Link>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2 text-[11px] text-slate-500">
          <span className="pill">Города и страны</span>
          <span className="pill">Кафе и заметки</span>
          <span className="pill">Оценки и лайки друзей</span>
        </div>
      </section>

      <section className="glass-card flex flex-col gap-3 bg-sky-900/5 p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 sm:text-base">
              Последние путешествия друзей
            </h2>
            <p className="mt-1 text-[11px] text-slate-500">
              Нажми на карточку, чтобы посмотреть детали.
            </p>
          </div>
        </div>
        {topTrips.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-sky-200 bg-sky-50/60 px-4 py-6 text-center text-xs text-slate-500">
            Пока нет поездок — начни с первой истории после авторизации.
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto pb-1">
            {topTrips.map((trip) => {
              const author =
                users.find((u) => u.id === trip.userId) ?? users[0];
              return <TripCard key={trip.id} trip={trip} author={author} />;
            })}
          </div>
        )}
      </section>
    </div>
  );
}
