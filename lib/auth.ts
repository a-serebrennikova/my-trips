import jwt from "jsonwebtoken";

export type AuthPayload = {
  userId: string;
  email: string;
};

const JWT_SECRET = process.env.JWT_SECRET;
const AUTH_SECRET = process.env.AUTH_SECRET;
const DEV_JWT_SECRET = "dev-jwt-secret";

const EFFECTIVE_JWT_SECRET = JWT_SECRET ?? AUTH_SECRET;

if (!EFFECTIVE_JWT_SECRET && process.env.NODE_ENV === "production") {
  throw new Error(
    "JWT_SECRET/AUTH_SECRET is not set. Set JWT_SECRET in production.",
  );
}

function getJwtSecret(): string {
  return EFFECTIVE_JWT_SECRET ?? DEV_JWT_SECRET;
}

export function signAuthToken(payload: AuthPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

export function verifyAuthToken(token: string): AuthPayload | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as AuthPayload;
    return decoded;
  } catch {
    return null;
  }
}

export function getBearerToken(authHeader?: string): string | null {
  if (!authHeader) return null;
  if (!authHeader.startsWith("Bearer ")) return null;
  return authHeader.slice("Bearer ".length).trim();
}
