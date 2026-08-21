import { User } from "../types";

type ProfileUpdate = Partial<User>;

export const normalizeNullableString = (value: unknown): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
};

export const applyStringField = (
  update: ProfileUpdate,
  field: "name" | "email" | "homeCity",
  value: unknown,
) => {
  const normalized = normalizeNullableString(value);

  if (normalized !== null) {
    update[field] = normalized;
  }
};

export const applyNullableField = (
  update: ProfileUpdate,
  field: "avatarUrl",
  value: unknown,
) => {
  if (value === undefined) {
    return;
  }

  update[field] = normalizeNullableString(value);
};

export const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

export const buildProfileUpdateFromRecord = (
  payload: Record<string, unknown>,
) => {
  const update: ProfileUpdate = {};

  applyStringField(update, "name", payload.name);
  applyStringField(update, "email", payload.email);
  applyStringField(update, "homeCity", payload.homeCity);
  applyNullableField(update, "avatarUrl", payload.avatarUrl);

  return update;
};
