"use server";

import { randomUUID } from "crypto";
import { createUserAuth, getUserAuthByEmail } from "../db/auth";
import { saltAndHashPassword } from "../utils/saltAndHashPassword";

type RegisterPayload = {
  email: string;
  password: string;
  name: string;
  homeCity: string;
};

type RegisterUserResult =
  | { ok: true; userId: string }
  | { ok: false; error: "EMAIL_TAKEN" | "INTERNAL_ERROR" };

export const registerUser = async ({
  email,
  password,
  name,
  homeCity,
}: RegisterPayload): Promise<RegisterUserResult> => {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await getUserAuthByEmail(normalizedEmail);
    if (existingUser) {
      return { ok: false, error: "EMAIL_TAKEN" };
    }

    const hashedPassword = await saltAndHashPassword(password);
    const userId = `u_${randomUUID()}`;

    await createUserAuth({
      id: userId,
      email: normalizedEmail,
      name,
      homeCity,
      passwordHash: hashedPassword,
    });

    return { ok: true, userId };
  } catch {
    console.error("[auth] registration failed", {
      email: email.trim().toLowerCase(),
    });
    return { ok: false, error: "INTERNAL_ERROR" };
  }
};
