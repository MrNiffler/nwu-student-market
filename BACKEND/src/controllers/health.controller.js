// src/controllers/health.controller.js
export function checkHealth(_req, res) {
  res.json({ status: "OK", message: "NWU Student Market Backend is healthy" });
}