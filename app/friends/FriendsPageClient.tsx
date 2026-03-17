"use client";

import { useEffect, useState } from "react";
import { Friends } from "@/components/friends/Friends";
import { fetchTravelData } from "@/lib/travelApi";
import type { User, Trip } from "@/lib/travelStore";

export function FriendsPageClient() {
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
      <header className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
          Друзья
        </h1>
        <p className="text-sm text-slate-600">
          Перейдите в профиль друга, чтобы посмотреть его путешествия, лайки и
          комментарии.
        </p>
      </header>

      <Friends trips={trips} users={users} />
    </div>
  );
}
