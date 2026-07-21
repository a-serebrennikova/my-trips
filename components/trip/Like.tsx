"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { toggleTripLike } from "@/store/travelApi";
import type { Trip } from "@/types";
import { useRouter } from "next/navigation";

interface Props {
  trip: Trip;
}

export function Like({ trip }: Props) {
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.currentUser);
  const authToken = useAuthStore((state) => state.authToken);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOwnTrip = trip.userId === currentUser?.id;
  const isLiked = currentUser
    ? trip.likedByUserIds.includes(currentUser.id)
    : false;

  const handleLikeClick = async () => {
    if (!currentUser || !trip) {
      router.push("/login");
      return;
    }

    if (isOwnTrip) return;

    setIsSubmitting(true);
    try {
      if (!authToken) {
        router.push("/login");
        return;
      }
      await toggleTripLike(trip.id, authToken);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  const canLike = currentUser && !isOwnTrip;

  if (isOwnTrip) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-500">
        <span>♡</span>
        <span>{trip.likedByUserIds.length} likes</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLikeClick}
      disabled={!canLike || isSubmitting}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        isLiked
          ? "border-rose-200 bg-rose-50 text-rose-500"
          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
      }`}
    >
      <span>{isLiked ? "♥" : "♡"}</span>
      <span>{trip.likedByUserIds.length} likes</span>
    </button>
  );
}
