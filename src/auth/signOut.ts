"use server";

import { signOut } from "../auth";

export async function signOutUser() {
  try {
    const result = await signOut({ redirectTo: "/" });

    return result;
  } catch (error) {
    console.error(error);
  }
}
