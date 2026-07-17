"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";

type RedirectLinkProps = {
  className?: string;
  signedInLabel?: string;
  signedOutLabel?: string;
  signedInHref?: string;
  signedOutHref?: string;
  disableWhenSignedOut?: boolean;
};

const defaultClassName =
  "inline-flex items-center justify-center gap-2 rounded-full bg-amber-400 px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-md shadow-amber-400/40 transition hover:bg-amber-300";

export function RedirectLink({
  className,
  signedInLabel = "Go to profile",
  signedOutLabel = "Sign in",
  signedInHref = "/me",
  signedOutHref = "/login",
  disableWhenSignedOut = false,
}: RedirectLinkProps) {
  const currentUser = useAuthStore((state) => state.currentUser);
  const buttonClassName = className ?? defaultClassName;

  if (currentUser) {
    return (
      <Link href={signedInHref} className={buttonClassName}>
        {signedInLabel}
      </Link>
    );
  }

  if (disableWhenSignedOut) {
    return (
      <span
        aria-disabled="true"
        className={`${buttonClassName} cursor-not-allowed opacity-45`}
      >
        {signedOutLabel}
      </span>
    );
  }

  return (
    <Link href={signedOutHref} className={buttonClassName}>
      {signedOutLabel}
    </Link>
  );
}
