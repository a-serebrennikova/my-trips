import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

type AuthState = {
  currentUser?: User;
  authToken?: string;
  hasHydrated: boolean;
  setCurrentUser: (user: User) => void;
  setAuthSession: (user: User, token: string) => void;
  clearCurrentUser: () => void;
  setHasHydrated: (value: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: undefined,
      authToken: undefined,
      hasHydrated: false,
      setCurrentUser: (user) => set({ currentUser: user }),
      setAuthSession: (user, token) =>
        set({ currentUser: user, authToken: token }),
      clearCurrentUser: () =>
        set({ currentUser: undefined, authToken: undefined }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
