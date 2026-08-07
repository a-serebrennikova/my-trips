"use client";

import { TagsColors } from "@/src/consts/tags";
import type { User } from "@/src/types";
import { getNameLetter } from "@/src/utils/getNameLetter";
import { EmailIcon } from "./icons/Email";
import { LocationPinIcon } from "./icons/LocationPin";
import { Avatar, Badge } from "@radix-ui/themes";

export type UserProfileStat = {
  label: string;
  value: string | number;
  color?: TagsColors;
};

type UserProfileHeaderProps = {
  user: User;
  stats: UserProfileStat[];
};

export const UserProfileHeader = ({ user, stats }: UserProfileHeaderProps) => {
  return (
    <section className="flex lg:flex-row justify-between">
      <div className="flex flex-col gap-4 sm:items-start">
        <div className="flex items-center gap-4">
          <Avatar
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
          <span className="text-standard text-slate-700">{user.homeCity}</span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2 lg:justify-end">
          {stats.map(({ label, value, color }) => (
            <Badge key={`label-${color}`} color={color} size="1">
              {label}: {value}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
};
