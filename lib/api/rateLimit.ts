type RateLimitOptions = {
  windowMs: number;
  max: number;
};

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

function nowMs(): number {
  return Date.now();
}

function cleanupExpiredBuckets(currentTimeMs: number): void {
  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= currentTimeMs) {
      buckets.delete(key);
    }
  }
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp) {
      return firstIp;
    }
  }

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) {
    return realIp;
  }

  return "unknown";
}

export function consumeRateLimit(
  key: string,
  options: RateLimitOptions,
): { ok: true; remaining: number } | { ok: false; retryAfterSec: number } {
  const currentTimeMs = nowMs();
  cleanupExpiredBuckets(currentTimeMs);

  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= currentTimeMs) {
    buckets.set(key, {
      count: 1,
      resetAt: currentTimeMs + options.windowMs,
    });

    return { ok: true, remaining: options.max - 1 };
  }

  existing.count += 1;

  if (existing.count > options.max) {
    const retryAfterSec = Math.max(
      1,
      Math.ceil((existing.resetAt - currentTimeMs) / 1000),
    );
    return { ok: false, retryAfterSec };
  }

  return {
    ok: true,
    remaining: Math.max(0, options.max - existing.count),
  };
}
