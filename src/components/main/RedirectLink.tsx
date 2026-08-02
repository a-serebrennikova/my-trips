"use client";

import Link from "next/link";

type RedirectLinkProps = {
  className?: string;
  signedInLabel: string;
  signedInHref: string;
};

export function RedirectLink({
  className,
  signedInLabel,
  signedInHref,
}: RedirectLinkProps) {
  const buttonClassName = className ?? "btn-primary-pill";

  return (
    <Link href={signedInHref} className={buttonClassName}>
      {signedInLabel}
    </Link>
  );
}
