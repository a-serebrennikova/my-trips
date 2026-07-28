import type { AuthPayload } from "@/lib/auth";
import { getBearerToken, verifyAuthToken } from "@/lib/auth";
import { unauthorized } from "./errors";

type AuthResult =
  | {
      ok: true;
      payload: AuthPayload;
    }
  | {
      ok: false;
      response: Response;
    };

export function requireAuth(request: Request, requestId: string): AuthResult {
  const token = getBearerToken(
    request.headers.get("authorization") ?? undefined,
  );
  if (!token) {
    return {
      ok: false,
      response: unauthorized("Unauthorized", requestId),
    };
  }

  const payload = verifyAuthToken(token);
  if (!payload) {
    return {
      ok: false,
      response: unauthorized("Invalid token", requestId),
    };
  }

  return {
    ok: true,
    payload,
  };
}
