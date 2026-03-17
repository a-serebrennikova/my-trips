"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/authStore";

interface AuthCheckProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthCheck({ children, fallback }: AuthCheckProps) {
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.currentUser);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push("/login");
    }
  }, [currentUser, isLoading, router]);

  if (isLoading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-pulse text-slate-500">Загрузка...</div>
        </div>
      )
    );
  }

  if (!currentUser) {
    return null;
  }

  return <>{children}</>;
}
