"use client";

import { useEffect, useState } from "react";
import { TripCard } from "@/components/trip/TripCard";
import { fetchTravelData } from "@/lib/travelApi";
import type { User, Trip } from "@/lib/travelStore";

export function FavoritesPageClient() {
  const [data, setData] = useState<{ users: User[]; trips: Trip[] } | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTravelData().then((result) => {
      setData(result);
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-pulse text-slate-500">Загрузка...</div>
      </div>
    );
  }

  const { users, trips } = data;

  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
            Избранное
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Путешествия друзей, которые тебе понравились
          </p>
        </div>
      </header>

      {trips.length === 0 ? (
        <div className="glass-card flex items-center justify-center px-6 py-12 text-center text-sm text-slate-500">
          У тебя пока нет избранных путешествий.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {trips.map((trip) => {
            const author = users.find((u) => u.id === trip.userId) ?? users[0];
            return <TripCard key={trip.id} trip={trip} author={author} />;
          })}
        </div>
      )}
    </div>
  );
}
