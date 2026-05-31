import { Router } from "express";
import { TaskController } from "../controllers/TaskController";
import { authMiddleware } from "../middlewares/authMiddleware";

const taskRoutes = Router();
const taskController = new TaskController();

taskRoutes.post(
  "/tasks",
  authMiddleware,
  taskController.create
);

taskRoutes.get(
  "/tasks",
  authMiddleware,
  taskController.list
);

taskRoutes.get(
  "/tasks/:id",
  authMiddleware,
  taskController.show
);

taskRoutes.put(
  "/tasks/:id",
  authMiddleware,
  taskController.update
);

taskRoutes.delete(
  "/tasks/:id",
  authMiddleware,
  taskController.delete
);

export { taskRoutes };