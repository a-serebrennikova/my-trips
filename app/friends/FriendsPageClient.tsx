"use client";

import { useState } from "react";
import useSWR from "swr";
import { Friends } from "@/components/friends/Friends";
import { PageLayout } from "@/components/layout/PageLayout";
import { fetchTravelData } from "@/store/travelApi";
import { ContentHeader } from "@/components/layout/ContentHeader";
import { LoadingIndicator } from "@/components/layout/LoadingIndicator";

export function FriendsPageClient() {
  // TODO(api): Move friends search to backend query when server-side filtering endpoint is available.
  const [query, setQuery] = useState("");
  const { data, error, isLoading } = useSWR("friends:travel", () =>
    fetchTravelData(),
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <LoadingIndicator message="Loading friends..." />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="glass-card flex items-center justify-center px-6 py-10 text-center text-sm text-rose-500">
        Failed to load friends data.
      </div>
    );
  }

  const { users, trips } = data;
  const friendsCount = users.length;

  return (
    <PageLayout className="space-y-5" withUnderlay={false}>
      <ContentHeader>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Friends
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Open a friend profile to see their trips, likes, and comments.
          </p>
          <p className="mt-1 text-xs text-slate-500">{friendsCount} friends</p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
          <label className="relative flex-1 lg:w-[360px]">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              ⌕
            </span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search friends..."
              className="w-full rounded-2xl border border-slate-300 bg-slate-50/95 px-10 py-2.5 text-sm text-slate-800 outline-none ring-sky-400 focus:ring-2"
            />
          </label>
          {/* TODO(api): Wire Add friend action to real invite/request flow.
                  Button is hidden until endpoint and UX flow are implemented. */}
          {/**
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-sky-300 bg-slate-50/95 px-4 py-2.5 text-sm font-semibold text-sky-700"
              >
                <span aria-hidden>👥</span>
                Add friend
              </button>
              */}
        </div>
      </ContentHeader>

      <Friends trips={trips} users={users} query={query} />
    </PageLayout>
  );
}
