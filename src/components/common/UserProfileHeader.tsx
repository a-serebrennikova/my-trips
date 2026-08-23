"use client";

import { useState } from "react";
import { TagsColors } from "@/src/consts/tags";
import type { User } from "@/src/types";
import { getNameLetter } from "@/src/utils/getNameLetter";
import { Avatar, Badge, Button } from "@radix-ui/themes";
import { Settings } from "./icons/Settings";
import { IconActionButton } from "./IconActionButton";
import { ChangeUserDataModal } from "@/src/components/me/ChangeUserDataModal";
import { Card } from "./Card";
import { GoBackButton } from "./GoBackButton";
import { ContactInfo } from "./ContactInfo";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const isCurrentUser = user.id === currentUserId;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex justify-between gap-1">
        <GoBackButton />
        {isCurrentUser && (
          <IconActionButton
            ariaLabel="Edit profile"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Settings />
          </IconActionButton>
        )}
      </div>

      <section className="flex flex-col justify-between gap-3">
        <div className="flex max-sm:flex-col justify-between gap-3">
          <div className="flex flex-col gap-6 items-start">
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
            <ContactInfo email={user.email} homeCity={user.homeCity} />
          </div>

          <div className="flex flex-col gap-4 items-end max-sm:flex-row max-sm:items-start">
            {stats.map(({ label, value, color }) => (
              <Badge
                key={`label-${color}`}
                color={color}
                size="1"
                className="w-fit"
              >
                {label}: {value}
              </Badge>
            ))}
          </div>
        </div>
        {isCurrentUser && (
          <div className="w-25">
            <Button variant="soft" color="red" onClick={handleSignOut}>
              Sign out
            </Button>
          </div>
        )}
      </section>

      {isEditModalOpen && (
        <ChangeUserDataModal
          open={isEditModalOpen}
          user={user}
          onOpenChange={setIsEditModalOpen}
        />
      )}
    </Card>
  );
};
