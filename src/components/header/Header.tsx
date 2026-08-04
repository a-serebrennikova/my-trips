"use client";

import { appConfig } from "../../config/app.config";
import { Logo } from "./Logo";
import { MenuDropdown } from "./MenuDropdown";
import { NavLink } from "./NavLink";

export function Header() {
  return (
    <header className="border-b border-teal-200 bg-teal-700 text-teal-50">
      <div className="flex w-full items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 rounded-2xl bg-teal-600 p-1.5 shadow-sm md:flex">
          {appConfig.routes.map((route) => (
            <NavLink key={route.href} href={route.href} label={route.label} />
          ))}
        </nav>

        <MenuDropdown />
      </div>
    </header>
  );
}
