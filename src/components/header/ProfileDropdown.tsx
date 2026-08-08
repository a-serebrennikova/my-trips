import { IconButton } from "@radix-ui/themes";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { ProfileIcon } from "./icons";

interface IProps {
  isProfileActive: boolean;
  onSignOut: () => void;
}

export const ProfileDropdown = ({ isProfileActive, onSignOut }: IProps) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <IconButton
          variant={isProfileActive ? "surface" : "classic"}
          size="2"
          radius="full"
          className="max-lg:hidden lg:inline-flex"
          aria-label="Open profile options"
        >
          <ProfileIcon />
        </IconButton>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={10}
          className="min-w-100 rounded-3xl border border-teal-200 bg-teal-600 p-3 shadow-xl"
        >
          <DropdownMenu.Item asChild>
            <Link
              href="/me"
              className={`mobile-menu-item ${
                isProfileActive
                  ? "mobile-menu-item-active"
                  : "mobile-menu-item-inactive"
              }`}
            >
              <ProfileIcon />
              Profile
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onSelect={(event) => {
              event.preventDefault();
              onSignOut();
            }}
            className="mobile-menu-item mobile-menu-item-inactive cursor-pointer outline-none"
          >
            <ProfileIcon />
            Sign out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
