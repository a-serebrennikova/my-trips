"use client";

import { useAuthStore } from "@/store/authStore";
import type { Trip, User } from "@/types";
import Link from "next/link";

interface Props {
  users: User[];
  trips: Trip[];
  query?: string;
}

export function Friends({ users, trips, query = "" }: Props) {
  const currentUser = useAuthStore((state) => state.currentUser);
  const filteredQuery = query.trim().toLowerCase();
  const friends = users.filter((user) => {
    if (user.id === currentUser?.id) {
      return false;
    }

    if (!filteredQuery) {
      return true;
    }

    const source = `${user.name} ${user.homeCity}`.toLowerCase();
    return source.includes(filteredQuery);
  });

  if (friends.length === 0) {
    return (
      <div className="glass-card px-6 py-10 text-center text-sm text-slate-500">
        No matching friends found.
      </div>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {friends.map((user) => {
        const userTrips = trips.filter((t) => t.userId === user.id);
        const totalTrips = userTrips.length;

        return (
          <article
            key={user.id}
            className="glass-card flex flex-col gap-3 bg-slate-50/95 p-4 text-left"
          >
            <div className="flex items-center gap-3">
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold text-white"
                style={{ backgroundColor: user.avatarColor }}
              >
                {user.name.charAt(0).toUpperCase()}
              </span>
              <div>
                <p className="text-2xl font-semibold leading-none tracking-tight text-slate-900">
                  {user.name}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {totalTrips} {totalTrips === 1 ? "trip" : "trips"}
                </p>
              </div>
            </div>

            <div className="pt-1 text-center">
              <Link
                href={`/friends/${user.id}`}
                className="inline-flex items-center gap-1 text-base font-semibold text-sky-600 transition hover:text-sky-500"
              >
                Open profile
                <span aria-hidden>→</span>
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
