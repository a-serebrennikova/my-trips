"use client";

import { IconButton } from "@radix-ui/themes";

type IconActionButtonProps = {
  children: React.ReactNode;
  ariaLabel: string;
  onClick: () => void;
  color?:
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
  color,
  className,
  variant,
}: IconActionButtonProps) {
  return (
    <IconButton
      variant={variant ?? "ghost"}
      size="2"
      color={color}
      onClick={onClick}
      aria-label={ariaLabel}
      className={className}
    >
      {children}
    </IconButton>
  );
}
