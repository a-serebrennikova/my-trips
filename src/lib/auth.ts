import jwt from "jsonwebtoken";

export type AuthPayload = {
  userId: string;
  email: string;
};

const JWT_SECRET = process.env.JWT_SECRET;
const AUTH_SECRET = process.env.AUTH_SECRET;

const EFFECTIVE_JWT_SECRET = JWT_SECRET ?? AUTH_SECRET ?? "dev-jwt-secret";

if (!JWT_SECRET && !AUTH_SECRET && process.env.NODE_ENV === "production") {
  console.warn(
    "JWT_SECRET/AUTH_SECRET is not set. Falling back to dev secret; set JWT_SECRET in production.",
  );
}

export function signAuthToken(payload: AuthPayload): string {
  return jwt.sign(payload, EFFECTIVE_JWT_SECRET, { expiresIn: "7d" });
}

export function verifyAuthToken(token: string): AuthPayload | null {
  try {
    const decoded = jwt.verify(token, EFFECTIVE_JWT_SECRET) as AuthPayload;
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
