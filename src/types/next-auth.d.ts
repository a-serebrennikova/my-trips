import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      avatarUrl?: string | null;
    };
  }

  interface User {
    avatarUrl?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    avatarUrl?: string | null;
  }
}
