"use client";

import { useState } from "react";
import Link from "next/link";
import { ProfileIcon } from "./icons";
import { FullScreenMenu } from "@/src/components/common/FullScreenMenu";
import { useSessionUserData } from "@/src/hooks/useSessionUserData";
import { ProfileButton } from "./ProfileButton";

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
      <ProfileButton
        avatarUrl={avatarUrl}
        userName={userName}
        onClick={() => setOpen(true)}
      />
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
