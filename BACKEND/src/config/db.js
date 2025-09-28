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

export async function assertDbConnection() {
  try {
    const { rows } = await pool.query("SELECT NOW()");
    console.log("Database connected successfully at:", rows[0].now);
  } catch (err) {
    console.error("Database connection error:", err.message);
    throw err;
  }
}
