import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import healthRouter from "./routes/health.route.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", healthRouter);

// Root route
app.get("/", (_req, res) => {
  res.json({ message: "NWU Student Market Backend running" });
});

export default app;
