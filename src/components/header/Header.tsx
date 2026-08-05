"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconButton } from "@radix-ui/themes";
import { appConfig } from "../../config/app.config";
import { Logo } from "./Logo";
import { MenuDropdown } from "./MenuDropdown";
import { NavLink } from "./NavLink";
import { ProfileIcon } from "./icons";

export function Header() {
  const pathname = usePathname();
  const isProfileActive = pathname === "/me";

  return (
    <header className="border-b border-teal-200 bg-teal-700 text-teal-50">
      <div className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Logo />

        <div className="flex justify-center">
          <nav className="hidden h-9 items-center gap-1 rounded-2xl bg-teal-600 p-1.5 shadow-sm md:flex">
            {appConfig.routes.map((route) => (
              <NavLink key={route.href} href={route.href} label={route.label} />
            ))}
          </nav>
        </div>

        <div className="flex items-center justify-end gap-2">
          {/* TODO: перенос вниз */}
          <MenuDropdown />
          <IconButton
            asChild
            variant={isProfileActive ? "surface" : "classic"}
            size="2"
            radius="full"
            aria-label="Open profile"
          >
            <Link href="/me">
              <ProfileIcon />
            </Link>
          </IconButton>
        </div>
      </div>
    </header>
  );
}
