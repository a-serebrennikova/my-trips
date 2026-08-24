"use client";

import { Plus } from "./icons/Plus";
import { IconActionButton } from "./IconActionButton";

export const CreateTripDividerAction = () => {
  return (
    <IconActionButton
      className="shrink-0"
      ariaLabel="Create trip"
      variant="soft"
      color="teal"
      href="/me/trip/create"
    >
      <Plus />
    </IconActionButton>
  );
};
