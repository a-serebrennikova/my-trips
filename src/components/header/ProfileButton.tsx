import { Avatar, IconButton } from "@radix-ui/themes";
import { getNameLetter } from "@/src/utils/getNameLetter";
import { ComponentPropsWithoutRef, forwardRef } from "react";

interface IProps extends Omit<
  ComponentPropsWithoutRef<typeof IconButton>,
  "children"
> {
  userName: string;
  avatarUrl?: string;
}

export const ProfileButton = forwardRef<HTMLButtonElement, IProps>(
  ({ avatarUrl, userName, ...buttonProps }, ref) => (
    <IconButton
      ref={ref}
      type="button"
      aria-label="Open profile menu"
      radius="full"
      {...buttonProps}
    >
      <Avatar
        src={avatarUrl}
        alt={userName}
        fallback={getNameLetter(userName)}
        size="2"
        radius="full"
        color="grass"
      />
    </IconButton>
  ),
);

ProfileButton.displayName = "ProfileButton";
