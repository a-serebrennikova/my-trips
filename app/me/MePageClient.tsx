"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TripCard } from "@/components/trip/TripCard";
import { fetchUserData } from "@/lib/travelApi";
import { useAuthStore } from "@/lib/authStore";
import type { User, Trip } from "@/lib/travelStore";

export function MePageClient() {
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.currentUser);
  const clearCurrentUser = useAuthStore((state) => state.clearCurrentUser);
  const [data, setData] = useState<{ users: User[]; trips: Trip[] } | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchUserData(currentUser.id).then((result) => {
        setData(result);
        setLoading(false);
      });
    }
  }, [currentUser]);

  const handleLogout = () => {
    clearCurrentUser();
    router.push("/login");
  };

  if (loading || !data || !currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-pulse text-slate-500">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="glass-card bg-white/95 p-6">
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
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {data.trips.map((trip) => {
          return <TripCard key={trip.id} trip={trip} author={currentUser} />;
        })}
      </div>

      {data.trips.length === 0 && (
        <div className="glass-card flex items-center justify-center px-6 py-12 text-center text-sm text-slate-500">
          У вас пока нет сохранённых путешествий.
        </div>
      )}

      <div className="pt-4">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
}
