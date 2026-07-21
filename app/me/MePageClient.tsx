"use client";

import { useRouter } from "next/navigation";
import useSWR from "swr";
import { PageLayout } from "@/components/layout/PageLayout";
import { TripCard } from "@/components/trip/TripCard";
import { fetchUserData } from "@/store/travelApi";
import { useAuthStore } from "@/store/authStore";
import { ContentHeader } from "@/components/layout/ContentHeader";
import { LoadingIndicator } from "@/components/layout/LoadingIndicator";

export function MePageClient() {
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.currentUser);
  const authToken = useAuthStore((state) => state.authToken);
  const clearCurrentUser = useAuthStore((state) => state.clearCurrentUser);
  const { data, error, isLoading, mutate } = useSWR(
    authToken ? ["me:travel", authToken] : null,
    ([, token]) => fetchUserData(token),
  );

  const handleLogout = () => {
    clearCurrentUser();
    router.push("/login");
  };

  if (error) {
    return (
      <PageLayout withUnderlay={false}>
        <div className="glass-card flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
          <p className="text-sm font-semibold text-rose-600">
            Failed to load profile data.
          </p>
          <p className="max-w-md text-xs text-slate-500">{error.message}</p>
          <button
            type="button"
            onClick={() => void mutate()}
            className="rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5 text-xs font-semibold text-sky-700 transition hover:bg-sky-100"
          >
            Try again
          </button>
        </div>
      </PageLayout>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <LoadingIndicator message="Loading profile..." />
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <PageLayout className="space-y-6" withUnderlay={false}>
      <ContentHeader>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span
              className="flex h-16 w-16 items-center justify-center rounded-full text-2xl font-semibold text-white"
              style={{ backgroundColor: currentUser.avatarColor }}
            >
              {currentUser.name.charAt(0).toUpperCase()}
            </span>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">
                {currentUser.name}
              </h1>
              <p className="text-sm text-slate-500">{currentUser.homeCity}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            Sign out
          </button>
        </div>
      </ContentHeader>

      <div className="grid gap-4 md:grid-cols-2">
        {data.trips.map((trip) => {
          return <TripCard key={trip.id} trip={trip} author={currentUser} />;
        })}
      </div>

      {data.trips.length === 0 && (
        <div className="glass-card flex items-center justify-center px-6 py-12 text-center text-sm text-slate-500">
          You do not have any saved trips yet.
        </div>
      )}
    </PageLayout>
  );
}
