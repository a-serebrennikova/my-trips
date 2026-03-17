import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "./travelStore";

type AuthState = {
  currentUser?: User;
  setCurrentUser: (user: User) => void;
  clearCurrentUser: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: undefined,
      setCurrentUser: (user) => set({ currentUser: user }),
      clearCurrentUser: () => set({ currentUser: undefined }),
    }),
    {
      name: "auth-storage",
    },
  ),
);
