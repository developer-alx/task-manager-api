import express from "express";
import cors from "cors";
import { userRoutes } from "./routes/userRoutes";
import { authRoutes } from "./routes/authRoutes";
import { taskRoutes } from "./routes/taskRoutes";
import { errorHandler } from "./shared/errors/errorHandler";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./shared/docs/swagger";

const app = express();

app.use(cors());
app.use(express.json());

// rotas
app.use(userRoutes);
app.use(authRoutes);
app.use(taskRoutes);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// middleware de erro (SEMPRE por último)
app.use(errorHandler);

export default app;