import pg from "pg";
import { env } from "./env.js";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.databaseUrl,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Log pool errors for debugging
pool.on('error', (err) => {
  console.error('[db] Unexpected error on idle client', err);
});

export async function query(text, params = []) {
  try {
    return await pool.query(text, params);
  } catch (e) {
    console.error('[db] Query error', { text, params, error: e.message });
    throw e;
  }
}

export async function healthCheck() {
  await pool.query("SELECT 1");
  return true;
}
