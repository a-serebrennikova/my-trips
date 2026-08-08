import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { z } from "zod";
import { getUserAuthByEmail, touchUserLastLoginAt } from "./db/auth";
import PostgresAdapter from "@auth/pg-adapter";
import { Pool } from "pg";

const credentialsSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export const { handlers, signIn, signOut, auth } = NextAuth(() => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  return {
    adapter: PostgresAdapter(pool),
    trustHost: true,
    secret: process.env.AUTH_SECRET,
    session: {
      strategy: "jwt",
      maxAge: 60 * 60,
      updateAge: 60 * 60 * 24,
    },
    providers: [
      Credentials({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(rawCredentials) {
          try {
            if (!rawCredentials?.email || !rawCredentials?.password) {
              throw new Error("Email and password are required");
            }

            const parsed = credentialsSchema.safeParse(rawCredentials);
            if (!parsed.success) {
              throw new Error("error");
            }

            const { email, password } = parsed.data;
            const user = await getUserAuthByEmail(email);

            if (!user) {
              throw new Error("error");
            }

            const isValidPassword = await compare(password, user.passwordHash);
            if (!isValidPassword) {
              throw new Error("error");
            }

            // Do not block login if audit timestamp update fails.
            touchUserLastLoginAt(user.id).catch((error) => {
              console.warn("[auth] failed to update last_login_at", error);
            });

            return {
              id: user.id,
              email: user.email,
              name: user.name,
              homeCity: user.home_city,
              avatarColor: user.avatar_color,
              updatedAt: user.updated_at,
            };
          } catch {
            return null;
          }
        },
      }),
    ],
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.userId = user.id;
          // token.homeCity = (user as { homeCity?: string }).homeCity ?? null;
          // token.avatarColor =
          //   (user as { avatarColor?: string }).avatarColor ?? null;
          // token.userUpdatedAt =
          //   (user as { updatedAt?: string }).updatedAt ?? null;
        }

        return token;
      },
      async session({ session, token }) {
        if (session.user) {
          session.user.id = (token.userId as string) ?? "";
          // session.user.homeCity =
          //   (token.homeCity as string | null | undefined) ?? null;
          // session.user.avatarColor =
          //   (token.avatarColor as string | null | undefined) ?? null;
          // session.user.updatedAt =
          //   (token.userUpdatedAt as string | null | undefined) ?? null;
        }

        return session;
      },
    },
  };
});
