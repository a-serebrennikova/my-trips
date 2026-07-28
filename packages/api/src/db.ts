import { Pool, type PoolClient, type QueryResultRow } from "pg";
import { logger } from "./logger";

const databaseUrl = process.env.DATABASE_URL;
const allowInsecureSsl = process.env.DB_SSL_ALLOW_INSECURE === "true";

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

export const pool = new Pool({
  connectionString: databaseUrl,
  ...(allowInsecureSsl
    ? {
        ssl: { rejectUnauthorized: false },
      }
    : {}),
});

const SLOW_QUERY_MS = Number(process.env.SLOW_QUERY_MS ?? "300");
const DB_KEEPALIVE_INTERVAL_MS = Number(
  process.env.DB_KEEPALIVE_INTERVAL_MS ?? "240000",
);

let keepAliveTimer: NodeJS.Timeout | undefined;

if (allowInsecureSsl) {
  logger.warn("Insecure SSL mode is enabled for database connection", {
    env: "DB_SSL_ALLOW_INSECURE=true",
  });
}

function compactSql(sql: string): string {
  return sql.replace(/\s+/g, " ").trim();
}

export async function query<T extends QueryResultRow>(
  text: string,
  params: unknown[] = [],
) {
  const started = process.hrtime.bigint();
  const result = await pool.query<T>(text, params);
  const elapsedMs = Number(process.hrtime.bigint() - started) / 1_000_000;

  if (elapsedMs >= SLOW_QUERY_MS) {
    logger.warn("Slow SQL query", {
      durationMs: Number(elapsedMs.toFixed(2)),
      thresholdMs: SLOW_QUERY_MS,
      rowCount: result.rowCount,
      sql: compactSql(text),
    });
  }

  return result;
}

export async function withTransaction<T>(
  fn: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function warmUpDatabase(): Promise<void> {
  const started = process.hrtime.bigint();
  await pool.query("SELECT 1");
  const elapsedMs = Number(process.hrtime.bigint() - started) / 1_000_000;
  console.info("Database warmup completed", {
    durationMs: Number(elapsedMs.toFixed(2)),
  });
}

export function startDatabaseKeepAlive(): void {
  if (
    !Number.isFinite(DB_KEEPALIVE_INTERVAL_MS) ||
    DB_KEEPALIVE_INTERVAL_MS < 1000
  ) {
    logger.warn("Database keep-alive is disabled due to invalid interval", {
      intervalMs: DB_KEEPALIVE_INTERVAL_MS,
    });
    return;
  }

  if (keepAliveTimer) return;

  keepAliveTimer = setInterval(() => {
    void pool.query("SELECT 1").catch((error: unknown) => {
      logger.warn("Database keep-alive ping failed", {
        error: error instanceof Error ? error.message : String(error),
      });
    });
  }, DB_KEEPALIVE_INTERVAL_MS);

  keepAliveTimer.unref();

  logger.info("Database keep-alive started", {
    intervalMs: DB_KEEPALIVE_INTERVAL_MS,
  });
}
