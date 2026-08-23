"use client";

import { CreateEditTripModal } from "@/src/components/me/CreateEditTripModal";
import { useState } from "react";
import { Plus } from "./icons/Plus";
import { IconActionButton } from "./IconActionButton";

export const CreateTripDividerAction = () => {
  const [isCreateTripModalOpen, setIsCreateTripModalOpen] = useState(false);

  return (
    <>
      <IconActionButton
        className="shrink-0"
        ariaLabel="Create trip"
        variant="soft"
        color="teal"
        onClick={() => setIsCreateTripModalOpen(true)}
      >
        <Plus />
      </IconActionButton>

      {isCreateTripModalOpen && (
        <CreateEditTripModal
          open={isCreateTripModalOpen}
          onOpenChange={setIsCreateTripModalOpen}
        />
      )}
    </>
  );
};
