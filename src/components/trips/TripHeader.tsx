"use client";

import { tagsColor } from "@/src/consts/tags";
import { Trip } from "@/src/types";
import { formatAmount } from "@/src/utils/formatAmount";
import { getDaysText } from "@/src/utils/getDaysText";
import { Avatar, Badge, Flex } from "@radix-ui/themes";
import Link from "next/link";
import { LikeButton } from "../common/LikeButton/LikeButton";
import { LocationIcon, ClockIcon, CalendarIcon } from "../main/icons";
import { formatDate } from "@/src/utils/dateFormat";
import { Card } from "../common/Card";
import { getNameLetter } from "@/src/utils/getNameLetter";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Settings } from "../common/icons/Settings";
import { deleteTrip } from "@/src/service/tripService";
import { ConfirmDialog } from "../common/ConfirmDialog";
import { IconActionButton } from "../common/IconActionButton";
import { Trash } from "../common/icons/Trash";
import { useSession } from "next-auth/react";
import { GoBackButton } from "../common/GoBackButton";

export const TripHeader = ({
  trip,
  tripId,
}: {
  trip: Trip;
  tripId: string;
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isDeleteTripModalOpen, setIsDeleteTripModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    approximateCost,
    city,
    country,
    days,
    startDate,
    endDate,
    currency,
    title,
    author,
    likedByUserIds,
  } = trip;

  const currentUserId = session?.user?.id ?? null;
  const isOwnTrip = currentUserId != null && author.id === currentUserId;

  const tripDateRange = `${formatDate(startDate)} — ${formatDate(endDate)}`;

  const handleDeleteTrip = async () => {
    setIsDeleting(true);

    try {
      await deleteTrip(tripId);
      setIsDeleteTripModalOpen(false);
      router.replace("/me");
    } catch {
      // Keep the dialog open so the user can retry.
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="gap-4 mb-4">
      <div className="flex justify-between gap-1">
        <GoBackButton />
        <Flex gap={"4"}>
          {isOwnTrip && (
            <IconActionButton
              color="red"
              ariaLabel="Delete trip"
              onClick={() => setIsDeleteTripModalOpen(true)}
            >
              <Trash />
            </IconActionButton>
          )}
          {isOwnTrip && (
            <IconActionButton
              ariaLabel="Edit trip"
              href={`/me/trip/${tripId}/edit`}
            >
              <Settings />
            </IconActionButton>
          )}
        </Flex>
      </div>

      <div className="flex justify-between gap-4 max-sm:flex-col">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="page-title">{title}</h1>
            <LikeButton
              tripId={tripId}
              currentUserId={currentUserId}
              initialLikedByUserIds={likedByUserIds}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Badge size="2" color={tagsColor.city}>
              <p className="inline-flex items-center gap-2">
                <LocationIcon className="text-slate-400" />
                {city}, {country}
              </p>
            </Badge>

            <Badge size="2" color={tagsColor.days}>
              <ClockIcon className="text-slate-400" />
              {getDaysText(days)}
            </Badge>

            <Badge size="2" color={tagsColor.period}>
              <CalendarIcon className="text-slate-400" />
              {tripDateRange}
            </Badge>

            <Badge size="2" color={tagsColor.cost}>
              <CalendarIcon className="text-slate-400" />
              {formatAmount(approximateCost, currency)}
            </Badge>
          </div>
        </div>
        <div className="self-center max-sm:self-start">
          <Link href={`/users/${author.id}`}>
            <div className="flex flex-col gap-2">
              <Avatar
                src={author.avatarUrl ?? undefined}
                alt={author.name}
                fallback={getNameLetter(author.name)}
                color="grass"
              />
              <span className="text-standard font-semibold">{author.name}</span>
            </div>
          </Link>
        </div>
      </div>

      <ConfirmDialog
        open={isDeleteTripModalOpen}
        onOpenChange={setIsDeleteTripModalOpen}
        title="Delete trip"
        description="This action cannot be undone. The trip will be removed from your profile and all trip lists."
        confirmLabel="Delete"
        isConfirming={isDeleting}
        onConfirm={handleDeleteTrip}
      />
    </Card>
  );
};
