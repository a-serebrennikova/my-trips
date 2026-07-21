"use client";

import { useRouter } from "next/navigation";
import type { Trip, User } from "@/types";
import { Like } from "./Like";

type TripCardProps = {
  trip: Trip;
  author: User;
  showImage?: boolean;
  detailsBelow?: boolean;
};

export function TripCard({
  trip,
  author,
  showImage = true,
  detailsBelow = false,
}: TripCardProps) {
  const router = useRouter();

  const handleOpen = () => {
    router.push(`/trips/${trip.id}`);
  };

  const ratingStars = "★★★★★".slice(0, trip.rating);

  return (
    <div className="glass-card flex w-full flex-col overflow-hidden text-left">
      {showImage ? (
        <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 sm:h-48">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-center text-slate-500">
            <span className="text-sm font-semibold">Photo not uploaded</span>
            <span className="px-3 text-[11px]">
              The user has not added a trip cover yet
            </span>
          </div>
          <div className="absolute left-3 top-3 flex gap-2">
            <span className="pill bg-sky-900/80 text-sky-50">
              {trip.city}, {trip.country}
            </span>
            <span className="pill bg-sky-50/95 text-sky-800">
              {trip.days} {trip.days === 1 ? "day" : "days"}
            </span>
          </div>
          <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-sky-50">
            <span className="text-[13px]">{ratingStars}</span>
            <span className="text-[11px] opacity-80">
              {trip.rating}.0 / 5 •{" "}
              {trip.approximateCost.toLocaleString("en-US")} {trip.currency}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-sky-100 bg-sky-50/70 px-4 py-3">
          <div className="flex flex-wrap gap-2">
            <span className="pill bg-sky-100 text-sky-800">
              {trip.city}, {trip.country}
            </span>
            <span className="pill bg-white text-sky-800">
              {trip.days} {trip.days === 1 ? "day" : "days"}
            </span>
          </div>
          <div className="rounded-full bg-slate-900/90 px-3 py-1 text-xs font-medium text-sky-50">
            {trip.rating}.0 / 5 • {trip.approximateCost.toLocaleString("en-US")}{" "}
            {trip.currency}
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col justify-between gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
              {trip.title}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              {new Date(trip.startDate).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
              })}{" "}
              —{" "}
              {new Date(trip.endDate).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
              })}
            </p>
          </div>
          <Like trip={trip} />
        </div>
        <div className="flex items-center justify-between border-t border-sky-50 pt-3 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: author.avatarColor }}
            >
              {author.name.charAt(0).toUpperCase()}
            </span>
            <div className="flex flex-col">
              <span className="font-medium text-slate-700">{author.name}</span>
              <span className="text-[10px]">from {author.homeCity}</span>
            </div>
          </div>
          {!detailsBelow ? (
            <button
              type="button"
              onClick={handleOpen}
              className="text-left transition hover:-translate-y-0.5 hover:shadow-2xl"
            >
              <span className="rounded-full bg-sky-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-sky-700">
                View details
              </span>
            </button>
          ) : null}
        </div>

        {detailsBelow ? (
          <div className="pt-1 text-center">
            <button
              type="button"
              onClick={handleOpen}
              className="inline-flex items-center gap-1 text-base font-semibold text-sky-600 transition hover:text-sky-500"
            >
              View details
              <span aria-hidden>→</span>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
