import { NextResponse } from "next/server";

export type ApiErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "TOO_MANY_REQUESTS"
  | "INTERNAL_ERROR";

type ApiErrorBody = {
  error: string;
  code: ApiErrorCode;
  requestId: string;
  details?: unknown;
};

type ResponseOptions = {
  requestId: string;
  details?: unknown;
  headers?: HeadersInit;
};

function toBody(
  message: string,
  code: ApiErrorCode,
  options: ResponseOptions,
): ApiErrorBody {
  const body: ApiErrorBody = {
    error: message,
    code,
    requestId: options.requestId,
  };

  if (typeof options.details !== "undefined") {
    body.details = options.details;
  }

  return body;
}

export function getRequestId(request: Request): string {
  const headerRequestId = request.headers.get("x-request-id")?.trim();
  return headerRequestId || crypto.randomUUID();
}

export function apiError(
  status: number,
  code: ApiErrorCode,
  message: string,
  options: ResponseOptions,
): NextResponse {
  return NextResponse.json(toBody(message, code, options), {
    status,
    headers: options.headers,
  });
}

export function badRequest(
  message: string,
  requestId: string,
  details?: unknown,
): NextResponse {
  return apiError(400, "BAD_REQUEST", message, { requestId, details });
}

export function unauthorized(message: string, requestId: string): NextResponse {
  return apiError(401, "UNAUTHORIZED", message, { requestId });
}

export function forbidden(message: string, requestId: string): NextResponse {
  return apiError(403, "FORBIDDEN", message, { requestId });
}

export function notFound(message: string, requestId: string): NextResponse {
  return apiError(404, "NOT_FOUND", message, { requestId });
}

export function tooManyRequests(
  message: string,
  requestId: string,
  retryAfterSec: number,
): NextResponse {
  return apiError(429, "TOO_MANY_REQUESTS", message, {
    requestId,
    details: { retryAfterSec },
    headers: { "Retry-After": String(retryAfterSec) },
  });
}

export function internalServerError(requestId: string): NextResponse {
  return apiError(500, "INTERNAL_ERROR", "Internal server error", {
    requestId,
  });
}
