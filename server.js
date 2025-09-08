import app from "./src/app.js";
import { assertDbConnection } from "./src/config/db.js";

const PORT = Number(process.env.PORT || 5000);

async function start() {
  try {
    await assertDbConnection();
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Startup failed:", err.message);
    process.exit(1);
  }
}

start();
