import { Session } from "next-auth";
import { create } from "zustand";

export type SessionStatus = "unauthenticated" | "authenticated" | "loading";

interface AuthState {
  isAuthenticated: boolean;
  status: SessionStatus;
  session: Session | null;
  setAuthState: (status: SessionStatus, session: Session | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  status: "unauthenticated",
  session: null,
  setAuthState: (status, session) =>
    set({ isAuthenticated: status === "authenticated", status, session }),
}));


