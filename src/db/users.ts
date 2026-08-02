import type { User } from "@/src/types";
import { query } from "./client";
import { mapDbUserToUser } from "./mappers";
import { type DbUser, USER_PUBLIC_SELECT_COLUMNS } from "./types";

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
