"use client";

import { IconButton } from "@radix-ui/themes";
import Link from "next/link";

type IconActionButtonProps = {
  children: React.ReactNode;
  ariaLabel: string;
  onClick?: () => void;
  href?: string;
  title?: string;
  color?:
    | "gray"
    | "blue"
    | "teal"
    | "cyan"
    | "green"
    | "grass"
    | "red"
    | "lime"
    | "mint"
    | "sky";
  className?: string;
  variant?: "ghost" | "solid" | "outline" | "classic" | "soft" | "surface";
};

export function IconActionButton({
  children,
  ariaLabel,
  onClick,
  href,
  title,
  color,
  className,
  variant,
}: IconActionButtonProps) {
  if (href) {
    return (
      <IconButton
        asChild
        variant={variant ?? "ghost"}
        size="2"
        color={color}
        aria-label={ariaLabel}
        title={title}
        className={className}
      >
        <Link href={href}>{children}</Link>
      </IconButton>
    );
  }

  return (
    <IconButton
      variant={variant ?? "ghost"}
      size="2"
      color={color}
      onClick={onClick}
      aria-label={ariaLabel}
      title={title}
      className={className}
    >
      {children}
    </IconButton>
  );
}
