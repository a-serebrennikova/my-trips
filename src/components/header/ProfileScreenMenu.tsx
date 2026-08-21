"use client";

import { useState } from "react";
import { Avatar, IconButton } from "@radix-ui/themes";
import Link from "next/link";
import { ProfileIcon } from "./icons";
import { FullScreenMenu } from "@/src/components/common/FullScreenMenu";
import { getNameLetter } from "@/src/utils/getNameLetter";
import { useSessionUserData } from "@/src/hooks/useSessionUserData";

interface IProps {
  isProfileActive: boolean;
  onSignOut: () => void;
}

export const ProfileScreenMenu = ({ isProfileActive, onSignOut }: IProps) => {
  const [open, setOpen] = useState(false);
  const { avatarUrl, userName } = useSessionUserData();

  const handleSignOut = () => {
    onSignOut();
    setOpen(false);
  };

  return (
    <>
      <IconButton
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open profile menu"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-teal-50 transition hover:bg-teal-500/20 lg:hidden"
      >
        <Avatar
          src={avatarUrl}
          alt={userName}
          fallback={getNameLetter(userName)}
          size="2"
          radius="full"
          color="grass"
        />
      </IconButton>

      <FullScreenMenu
        open={open}
        title="Profile"
        onClose={() => setOpen(false)}
      >
        <div className="space-y-2 p-3">
          <Link
            href="/me"
            onClick={() => setOpen(false)}
            className={`mobile-menu-item ${
              isProfileActive
                ? "mobile-menu-item-active"
                : "mobile-menu-item-inactive"
            }`}
          >
            <ProfileIcon />
            Profile
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="mobile-menu-item mobile-menu-item-inactive w-full text-left outline-none"
          >
            <ProfileIcon />
            Sign out
          </button>
        </div>
      </FullScreenMenu>
    </>
  );
};
