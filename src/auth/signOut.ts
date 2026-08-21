"use server";

import { signOut } from "../auth";

export async function signOutUser() {
  try {
    await signOut({ redirect: false });
    return { ok: true };
  } catch (error) {
    console.error(error);
    return { ok: false };
  }
}
