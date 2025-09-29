// ================================
// NODE.JS BACKEND SETUP (server.js)
// ================================

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { Pool } from "pg"; // PostgreSQL client

import reviewRoutes from "./routes/reviewRoutes.js"; // Express routes for reviews

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL connection setup
export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test DB connection
pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => console.error("❌ DB connection error", err));

// Register routes
app.use("/api/reviews", reviewRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
