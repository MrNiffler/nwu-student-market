import app from "./src/app.js";
import { assertDbConnection } from "./src/config/db.js"; // ✅ correct

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await assertDbConnection();
    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
}

startServer();
