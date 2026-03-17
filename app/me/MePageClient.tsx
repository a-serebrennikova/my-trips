"use client";

import { useEffect, useState } from "react";
import { TripCard } from "@/components/trip/TripCard";
import { fetchUserData } from "@/lib/travelApi";
import { useAuthStore } from "@/lib/authStore";
import type { User, Trip } from "@/lib/travelStore";

export function MePageClient() {
  const currentUser = useAuthStore((state) => state.currentUser);
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

  if (loading || !data || !currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-pulse text-slate-500">Загрузка...</div>
      </div>
    );
  }

  return (
    <div>
      <p>ИМЯ {currentUser.name}</p>
      <div className="grid gap-4 md:grid-cols-2">
        {data.trips.map((trip) => {
          return <TripCard key={trip.id} trip={trip} author={currentUser} />;
        })}
      </div>
    </div>
  );
}
