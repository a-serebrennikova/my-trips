"use client";

import useSWR from "swr";
import { PageLayout } from "@/components/layout/PageLayout";
import { TripCard } from "@/components/trip/TripCard";
import { useAuthStore } from "@/store/authStore";
import { fetchTravelData } from "@/store/travelApi";

export function FavoritesPageClient() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const { data, error, isLoading } = useSWR("favorites:travel", () =>
    fetchTravelData(),
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100dvh-10.5rem)] items-center justify-center">
        <div className="animate-pulse text-slate-500">Loading...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="glass-card flex min-h-[calc(100dvh-10.5rem)] items-center justify-center px-6 py-12 text-center text-sm text-rose-500">
        Failed to load favorite trips.
      </div>
    );
  }

  const { users, trips } = data;
  const favoriteTrips = currentUser
    ? trips.filter(
        (trip) =>
          trip.likedByUserIds.includes(currentUser.id) &&
          trip.userId !== currentUser.id,
      )
    : [];

  return (
    <PageLayout className="space-y-5">
      <header className="rounded-2xl bg-slate-100/80 p-3 sm:p-4 ring-1 ring-slate-200/80">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Favorites
          </h1>
          <p className="text-sm text-slate-600">
            Trips from your friends that you liked.
          </p>
          <p className="text-xs text-slate-500">
            {favoriteTrips.length} favorites
          </p>
        </div>
      </header>

      {favoriteTrips.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-sky-300 bg-slate-50/90 px-6 py-12 text-center text-sm text-slate-500">
          You do not have any favorite trips yet.
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {favoriteTrips.map((trip) => {
            const author = users.find((u) => u.id === trip.userId) ?? users[0];
            return (
              <TripCard
                key={trip.id}
                trip={trip}
                author={author}
                detailsBelow
              />
            );
          })}
        </div>
      )}
    </PageLayout>
  );
}
