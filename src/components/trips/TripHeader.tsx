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
import { appConfig } from "@/src/config/app.config";
import { Card } from "../common/Card";
import { getNameLetter } from "@/src/utils/getNameLetter";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Settings } from "../common/icons/Settings";
import { CreateEditTripModal } from "../me/CreateEditTripModal";
import { deleteTrip } from "@/src/service/tripService";
import { ConfirmDialog } from "../common/ConfirmDialog";
import { IconActionButton } from "../common/IconActionButton";
import { Trash } from "../common/icons/Trash";

export const TripHeader = ({
  trip,
  tripId,
  showCreateTripButton = false,
}: {
  trip: Trip;
  tripId: string;
  showCreateTripButton?: boolean;
}) => {
  const router = useRouter();
  const [isEditTripModalOpen, setIsEditTripModalOpen] = useState(false);
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

  const isOwnTrip = author.id === appConfig.defaultUserId;

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
    <Card>
      <div className="flex justify-between">
        <Link
          href="/trips"
          className="inline-flex items-center gap-2 text-standard font-medium text-sky-700 transition hover:text-sky-500"
        >
          <span aria-hidden>←</span>
          <span>Back to trips</span>
        </Link>
        <Flex gap={'4'}>
          {showCreateTripButton && (
            <IconActionButton
              ariaLabel="Edit trip"
              onClick={() => setIsEditTripModalOpen(true)}
            >
              <Settings />
            </IconActionButton>
          )}
          {isOwnTrip && (
            <IconActionButton
              color="red"
              ariaLabel="Delete trip"
              onClick={() => setIsDeleteTripModalOpen(true)}
            >
              <Trash />
            </IconActionButton>
          )}
        </Flex>
      </div>

      <div className="mt-4 flex  justify-between gap-3 ">
        <div className="mt-4 flex flex-col gap-3 lg:mt-0">
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="page-title">{title}</h1>
            <LikeButton
              tripId={tripId}
              currentUserId={appConfig.defaultUserId}
              initialLikedByUserIds={likedByUserIds}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Badge size="3" color={tagsColor.city}>
              <p className="inline-flex items-center gap-2">
                <LocationIcon className="text-slate-400" />
                {city}, {country}
              </p>
            </Badge>

            <Badge size="3" color={tagsColor.days}>
              <ClockIcon className="text-slate-400" />
              {getDaysText(days)}
            </Badge>

            <Badge size="3" color={tagsColor.period}>
              <CalendarIcon className="text-slate-400" />
              {tripDateRange}
            </Badge>

            <Badge size="3" color={tagsColor.cost}>
              <CalendarIcon className="text-slate-400" />
              {formatAmount(approximateCost, currency)}
            </Badge>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Avatar fallback={getNameLetter(author.name)} color="grass" />
          <span className="text-standard font-semibold">{author.name}</span>
        </div>
      </div>

      <CreateEditTripModal
        open={isEditTripModalOpen}
        onOpenChange={setIsEditTripModalOpen}
        mode="edit"
        tripId={tripId}
        initialValues={{
          title,
          city,
          country,
          startDate,
          endDate,
          approximateCost,
          currency,
          notes: trip.notes,
        }}
      />

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
