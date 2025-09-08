import { Router } from "express";
import { pool } from "../config/db.js";

const router = Router();

router.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", db: "ok" });
  } catch (e) {
    res.status(500).json({ status: "error", db: "down", error: e.message });
  }
});

export default router;
