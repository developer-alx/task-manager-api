"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const database_1 = require("./database");
dotenv_1.default.config();
async function startServer() {
    try {
        const result = await database_1.pool.query("SELECT current_database()");
        console.log("Database connected");
        console.log(result.rows);
        const PORT = 3333;
        app_1.default.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}✅🚀💻`);
        });
    }
    catch (err) {
        console.error("Database connection error:", err);
        process.exit(1);
    }
}
startServer();
