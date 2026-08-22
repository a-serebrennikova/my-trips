"use client";

import { useState } from "react";
import { TagsColors } from "@/src/consts/tags";
import type { User } from "@/src/types";
import { getNameLetter } from "@/src/utils/getNameLetter";
import { EmailIcon } from "./icons/Email";
import { LocationPinIcon } from "./icons/LocationPin";
import { Avatar, Badge } from "@radix-ui/themes";
import { Settings } from "./icons/Settings";
import { IconActionButton } from "./IconActionButton";
import { ChangeUserDataModal } from "@/src/components/me/ChangeUserDataModal";

export type UserProfileStat = {
  label: string;
  value: string | number;
  color?: TagsColors;
};

type UserProfileHeaderProps = {
  user: User;
  stats: UserProfileStat[];
  currentUserId?: string | null;
};

export const UserProfileHeader = ({
  user,
  stats,
  currentUserId = null,
}: UserProfileHeaderProps) => {
  const isCurrentUser = user.id === currentUserId;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <>
      <section className="flex lg:flex-row justify-between gap-1">
        <div className="flex flex-col gap-4 sm:items-start">
          <div className="flex items-center gap-4">
            <Avatar
              src={user.avatarUrl ?? undefined}
              alt={user.name}
              fallback={getNameLetter(user.name)}
              color="grass"
              size="6"
              radius="large"
            />
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-title">
              {user.name}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <EmailIcon className="h-4 w-4" />
            <span className="text-standard text-slate-700">{user.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <LocationPinIcon className="h-4 w-4" />
            <span className="text-standard text-slate-700">
              {user.homeCity}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4 align-items-end">
          <div className="flex justify-end">
            {isCurrentUser && (
              <IconActionButton
                ariaLabel="Edit profile"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Settings />
              </IconActionButton>
            )}
          </div>
          <div className="flex flex-wrap gap-2 justify-end">
            {stats.map(({ label, value, color }) => (
              <Badge key={`label-${color}`} color={color} size="1">
                {label}: {value}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {isEditModalOpen && (
        <ChangeUserDataModal
          open={isEditModalOpen}
          user={user}
          onOpenChange={setIsEditModalOpen}
        />
      )}
    </>
  );
};
