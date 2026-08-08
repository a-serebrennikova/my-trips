"use server";

import { signIn } from "../auth";

export async function signInUser(email: string, password: string) {
  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return result;
  } catch {
    console.error("[auth] sign-in failed", { email });
    return null;
  }
}
