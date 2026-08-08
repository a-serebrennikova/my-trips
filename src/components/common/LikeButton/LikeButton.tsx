"use client";
import { useCallback } from "react";
import { IconButton } from "@radix-ui/themes";
import { Like } from "../icons/Like";
import { useLike } from "./ useLike";
import { toggleTripLike } from "@/src/service/tripService";

interface LikeButtonProps {
  tripId: string;
  currentUserId: string | null;
  initialLikedByUserIds: string[];
}

export function LikeButton({
  tripId,
  currentUserId,
  initialLikedByUserIds,
}: LikeButtonProps) {
  const initialLiked =
    currentUserId != null && initialLikedByUserIds.includes(currentUserId);
  const initialLikesCount = initialLikedByUserIds.length;

  const sendLikeRequest = useCallback(
    async (_nextLikedState: boolean, signal: AbortSignal) => {
      return toggleTripLike(tripId, signal);
    },
    [tripId],
  );

  const { liked, toggleLike } = useLike(sendLikeRequest, {
    initialLiked,
    debounceDelay: 500,
  });

  const likesCount =
    liked === initialLiked
      ? initialLikesCount
      : liked
        ? initialLikesCount + 1
        : Math.max(0, initialLikesCount - 1);

  return (
    <div className="flex items-center gap-2">
      <IconButton
        variant="ghost"
        size="2"
        color="gray"
        onClick={currentUserId ? toggleLike : undefined}
        disabled={!currentUserId}
        aria-pressed={liked}
        aria-label={liked ? "Remove like" : "Like this trip"}
      >
        <div className="flex items-center gap-1">
          <Like isLiked={liked} />
          {likesCount}
        </div>
      </IconButton>
    </div>
  );
}
