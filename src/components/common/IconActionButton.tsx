"use client";

import { IconButton } from "@radix-ui/themes";

type IconActionButtonProps = {
  children: React.ReactNode;
  ariaLabel: string;
  onClick: () => void;
  color?: "gray" | "red";
  className?: string;
};

export function IconActionButton({
  children,
  ariaLabel,
  onClick,
  color = "gray",
  className,
}: IconActionButtonProps) {
  return (
    <IconButton
      variant="ghost"
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
