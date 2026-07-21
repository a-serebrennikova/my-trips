import { compare as comparePassword, hash as hashPassword } from "bcryptjs";
import type { User } from "@/src/types";
import { query } from "./client";
import { mapDbUserToUser } from "./mappers";
import {
  BCRYPT_ROUNDS,
  type DbUser,
  USER_PUBLIC_SELECT_COLUMNS,
  USER_SELECT_COLUMNS,
} from "./types";

function isBcryptHash(value: string): boolean {
  return (
    value.startsWith("$2a$") ||
    value.startsWith("$2b$") ||
    value.startsWith("$2y$")
  );
}

export async function getUserById(userId: string): Promise<User | null> {
  const result = await query<DbUser>(
    `SELECT ${USER_PUBLIC_SELECT_COLUMNS} FROM users WHERE id = $1 LIMIT 1`,
    [userId],
  );
  const user = result.rows[0];
  return user ? mapDbUserToUser(user) : null;
}

export async function getUsers(): Promise<User[]> {
  const result = await query<DbUser>(
    `SELECT ${USER_PUBLIC_SELECT_COLUMNS} FROM users ORDER BY name ASC`,
  );
  return result.rows.map(mapDbUserToUser);
}

export async function loginUser(
  email: string,
  password: string,
): Promise<User | null> {
  const result = await query<DbUser>(
    `SELECT ${USER_SELECT_COLUMNS} FROM users WHERE email = $1 LIMIT 1`,
    [email],
  );

  const user = result.rows[0];
  if (!user) return null;

  let isValidPassword = false;

  if (isBcryptHash(user.password)) {
    isValidPassword = await comparePassword(password, user.password);
  } else if (user.password === password) {
    isValidPassword = true;
    const upgradedHash = await hashPassword(password, BCRYPT_ROUNDS);
    await query(`UPDATE users SET password = $1 WHERE id = $2`, [
      upgradedHash,
      user.id,
    ]);
  }

  if (!isValidPassword) return null;
  return mapDbUserToUser(user);
}
