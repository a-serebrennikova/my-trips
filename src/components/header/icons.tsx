import { ReactElement } from "react";
import { TripsIcon } from "../common/icons/TripsIcon";

export const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0">
    <path
      d="M4 11.2 12 4l8 7.2V20a1 1 0 0 1-1 1h-4.8v-5.2H9.8V21H5a1 1 0 0 1-1-1v-8.8Z"
      fill="currentColor"
    />
  </svg>
);

export const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0">
    <path
      d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
      fill="currentColor"
    />
    <path
      d="M3.5 20c.4-3.1 2.4-5 4.5-5s4.1 1.9 4.5 5m4-1.5c.3-2.1 1.5-3.5 3.5-3.5s3.2 1.4 3.5 3.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

export const ProfileIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0">
    <path
      d="M12 12.2a4.1 4.1 0 1 0 0-8.2 4.1 4.1 0 0 0 0 8.2Z"
      fill="currentColor"
    />
    <path d="M4.5 21c.5-3.6 3.4-6 7.5-6s7 2.4 7.5 6" fill="currentColor" />
  </svg>
);

export const BurgerIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="h-5 w-5"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 7h16M4 12h16M4 17h16"
    />
  </svg>
);

export const NAV_ICONS: Record<string, () => ReactElement> = {
  "/": HomeIcon,
  "/trips": TripsIcon,
  "/users": UsersIcon,
};
