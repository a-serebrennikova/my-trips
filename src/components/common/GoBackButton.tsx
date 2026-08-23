"use client";

import { useRouter } from "next/navigation";

export const GoBackButton = () => {
  const router = useRouter();

  return (
    <button
      className="hover:text-teal-600 self-start"
      onClick={() => {
        router.back();
      }}
    >
      <span>← Back</span>
    </button>
  );
};
