"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "../lib/authStore";

const navLinkBase =
  "px-3 py-2 rounded-full text-sm font-medium transition-colors";

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== "/" && pathname?.startsWith(href));

  return (
    <Link
      href={href}
      className={`${navLinkBase} ${
        isActive
          ? "bg-white text-sky-700 shadow-sm"
          : "text-sky-50/90 hover:bg-sky-500/60"
      }`}
    >
      {label}
    </Link>
  );
}

export function Header() {
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.currentUser);

  return (
    <header className="bg-sky-700 text-sky-50">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="flex items-center gap-2"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-white text-sky-600 shadow-sm">
            <span className="text-lg font-bold">✈</span>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-base font-semibold leading-tight">
              myTrips
            </span>
            <span className="text-[11px] leading-tight text-sky-100/80">
              Твои истории путешествий
            </span>
          </div>
        </button>

        <nav className="hidden items-center gap-2 sm:flex">
          <NavLink href="/trips" label="Путешествия" />
          <NavLink href="/favorites" label="Избранное" />
          <NavLink href="/friends" label="Друзья" />
        </nav>

        <div className="flex items-center gap-3">
          {currentUser ? (
            <button
              type="button"
              onClick={() => router.push("/me")}
              className="flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium text-sky-800 shadow-sm hover:bg-white"
            >
              <span
                className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: currentUser.avatarColor }}
              >
                {currentUser.name.charAt(0).toUpperCase()}
              </span>
              <span className="hidden sm:inline">{currentUser.name}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-sky-700 shadow-sm transition hover:bg-sky-50"
            >
              Войти
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
