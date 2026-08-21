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

export async function updateUserProfile(
  userId: string,
  data: Partial<{
    name: string;
    email: string;
    homeCity: string;
    avatarUrl: string | null;
  }>,
): Promise<User | null> {
  const updates: string[] = [];
  const values: unknown[] = [];

  if (typeof data.name === "string") {
    updates.push(`name = $${values.length + 1}`);
    values.push(data.name.trim());
  }

  if (typeof data.email === "string") {
    updates.push(`email = $${values.length + 1}`);
    values.push(data.email.trim().toLowerCase());
  }

  if (typeof data.homeCity === "string") {
    updates.push(`home_city = $${values.length + 1}`);
    values.push(data.homeCity.trim());
  }

  if (data.avatarUrl !== undefined) {
    updates.push(`avatar_url = $${values.length + 1}`);
    values.push(data.avatarUrl === null ? null : data.avatarUrl.trim());
  }

  if (!updates.length) {
    return getUserById(userId);
  }

  values.push(userId);

  const result = await query<DbUser>(
    `UPDATE users
      SET ${updates.join(", ")}
      WHERE id = $${values.length}
      RETURNING ${USER_PUBLIC_SELECT_COLUMNS}`,
    values,
  );

  const user = result.rows[0];
  return user ? mapDbUserToUser(user) : null;
}
