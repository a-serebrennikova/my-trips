"use client";

import { ReactNode } from "react";

type FullScreenMenuProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export const FullScreenMenu = ({
  open,
  title,
  onClose,
  children,
}: FullScreenMenuProps) => {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="flex h-dvh w-screen flex-col bg-teal-700 text-teal-50 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-teal-500/40 px-5 py-4">
          <p className="text-lg font-semibold">{title}</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="rounded-full bg-teal-500/15 px-3 py-2 text-sm font-medium text-teal-50 transition hover:bg-teal-500/25"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">{children}</div>
      </aside>
    </div>
  );
};
