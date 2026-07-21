"use client";

import { useRouter } from "next/navigation";
import useSWR from "swr";
import { PageLayout } from "@/components/layout/PageLayout";
import { TripCard } from "@/components/trip/TripCard";
import { fetchUserData } from "@/store/travelApi";
import { useAuthStore } from "@/store/authStore";

export function MePageClient() {
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.currentUser);
  const authToken = useAuthStore((state) => state.authToken);
  const clearCurrentUser = useAuthStore((state) => state.clearCurrentUser);
  const { data, error, isLoading } = useSWR(
    authToken ? ["me:travel", authToken] : null,
    ([, token]) => fetchUserData(token),
  );

  const handleLogout = () => {
    clearCurrentUser();
    router.push("/login");
  };

  if (!currentUser || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-pulse text-slate-500">Loading...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="glass-card flex items-center justify-center px-6 py-12 text-center text-sm text-rose-500">
        Failed to load profile data.
      </div>
    );
  }

  return (
    <PageLayout className="space-y-6">
      <div className="glass-card bg-white/95 p-6">
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
      </div>

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
