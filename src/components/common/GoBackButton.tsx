"use client";

import { useRouter } from "next/navigation";

export const GoBackButton = () => {
  const router = useRouter();

  return (
    <button
      className="hover:text-blue-600"
      onClick={() => {
        router.back();
      }}
    >
      <span>← Back</span>
    </button>
  );
};
