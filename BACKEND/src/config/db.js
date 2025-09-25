import dotenv from "dotenv";
import pkg from "pg";
dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: Number(process.env.DB_PORT || 5432),
});

// Quick self-test
export async function assertDbConnection() {
  const { rows } = await pool.query("SELECT 1 as ok");
  if (!rows || !rows[0] || rows[0].ok !== 1) throw new Error("DB self-test failed");
}
