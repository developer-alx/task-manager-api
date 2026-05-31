import dotenv from "dotenv";
import app from "./app";
import { pool } from "./database";

dotenv.config();

async function startServer() {
  try {
    const result = await pool.query("SELECT current_database()");

    console.log("Database connected");
    console.log(result.rows);

    const PORT = 3333;

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}✅🚀💻`);
    });

  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
}

startServer();
