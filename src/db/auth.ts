import { query } from "./client";
import { type DbUserWithPasswordHash, USER_SELECT_COLUMNS } from "./types";

type CreateUserAuthInput = {
  id: string;
  email: string;
  name: string;
  homeCity: string;
  passwordHash: string;
};

export async function getUserAuthByEmail(
  email: string,
): Promise<DbUserWithPasswordHash | null> {
  const normalizedEmail = email.trim().toLowerCase();

  const result = await query<DbUserWithPasswordHash>(
    `SELECT ${USER_SELECT_COLUMNS} FROM users WHERE LOWER(email) = $1 LIMIT 1`,
    [normalizedEmail],
  );

  return result.rows[0] ?? null;
}

export async function touchUserLastLoginAt(userId: string): Promise<void> {
  await query(
    `UPDATE users SET last_login_at = NOW(), updated_at = NOW() WHERE id = $1`,
    [userId],
  );
}

export async function createUserAuth({
  id,
  email,
  name,
  homeCity,
  passwordHash,
}: CreateUserAuthInput): Promise<string> {
  const normalizedEmail = email.trim().toLowerCase();

  const result = await query<{ id: string }>(
    `INSERT INTO users (id, name, email, password_hash, home_city, updated_at)
     VALUES ($1, $2, $3, $4, $5, NOW())
     RETURNING id`,
    [id, name.trim(), normalizedEmail, passwordHash, homeCity.trim()],
  );

  return result.rows[0]?.id ?? id;
}
