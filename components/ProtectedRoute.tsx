"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.currentUser);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (!currentUser) {
      router.push("/login");
    }
  }, [currentUser, hasHydrated, router]);

  if (!hasHydrated || !currentUser) {
    return (
      fallback || (
        <div className="flex min-h-[calc(100dvh-10.5rem)] items-center justify-center">
          <div className="animate-pulse text-slate-500">
            Checking authorization...
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}
