import { Pool, type PoolClient, type QueryResultRow } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

export const pool = new Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
});

const SLOW_QUERY_MS = Number(process.env.SLOW_QUERY_MS ?? "300");

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
    console.warn("[slow-query]", {
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
