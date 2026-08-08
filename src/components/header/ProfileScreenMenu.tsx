"use client";

import { useState } from "react";
import { IconButton } from "@radix-ui/themes";
import Link from "next/link";
import { ProfileIcon } from "./icons";
import { FullScreenMenu } from "@/src/components/common/FullScreenMenu";

interface IProps {
  isProfileActive: boolean;
  onSignOut: () => void;
}

export const ProfileScreenMenu = ({ isProfileActive, onSignOut }: IProps) => {
  const [open, setOpen] = useState(false);

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
        <ProfileIcon />
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
