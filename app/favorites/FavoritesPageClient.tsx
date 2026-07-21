"use client";

import useSWR from "swr";
import { PageLayout } from "@/components/layout/PageLayout";
import { TripCard } from "@/components/trip/TripCard";
import { useAuthStore } from "@/store/authStore";
import { fetchTravelData } from "@/store/travelApi";
import { ContentHeader } from "@/components/layout/ContentHeader";
import { LoadingIndicator } from "@/components/layout/LoadingIndicator";

export function FavoritesPageClient() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const { data, error, isLoading } = useSWR("favorites:travel", () =>
    fetchTravelData(),
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100dvh-10.5rem)] items-center justify-center">
        <LoadingIndicator message="Loading favorites..." />
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
    <PageLayout className="space-y-5" withUnderlay={false}>
      <ContentHeader>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Favorites
        </h1>
        <p className="text-sm text-slate-600">
          Trips from your friends that you liked.
        </p>
        <p className="text-xs text-slate-500">
          {favoriteTrips.length} favorites
        </p>
      </ContentHeader>

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
