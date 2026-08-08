"use client";

import { useState } from "react";
import { IconButton } from "@radix-ui/themes";
import Link from "next/link";
import { BurgerIcon, HomeIcon, NAV_ICONS, ProfileIcon } from "./icons";
import { appConfig } from "@/src/config/app.config";
import { usePathname } from "next/navigation";
import { FullScreenMenu } from "@/src/components/common/FullScreenMenu";

export const NavigationScreenMenu = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
        className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-teal-50 transition hover:bg-teal-500/20"
      >
        <BurgerIcon />
      </IconButton>

      <FullScreenMenu
        open={open}
        title="Navigation"
        onClose={() => setOpen(false)}
      >
        <nav className="space-y-2 p-3">
          {appConfig.routes.map((route) => {
            const isActive =
              pathname === route.href ||
              (route.href !== "/" && pathname?.startsWith(route.href));

            return (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setOpen(false)}
                className={`mobile-menu-item ${
                  isActive
                    ? "mobile-menu-item-active"
                    : "mobile-menu-item-inactive"
                }`}
              >
                {(() => {
                  if (route.href === "/me") {
                    return <ProfileIcon />;
                  }

                  const Icon = NAV_ICONS[route.href] ?? HomeIcon;
                  return <Icon />;
                })()}
                {route.label}
              </Link>
            );
          })}
        </nav>
      </FullScreenMenu>
    </>
  );
};
