import { Request, Response } from "express";
import { CreateTaskService } from "../services/CreateTaskService";
import { ListTasksService } from "../services/ListTasksService";
import { GetTaskByIdService } from "../services/GetTaskByIdService";
import { UpdateTaskService } from "../services/UpdateTaskService";
import { DeleteTaskService } from "../services/DeleteTaskService";

export class TaskController {

  async create(request: Request, response: Response) {
    const { title, description } = request.body;

    const userId = Number(request.userId);
    if (!request.userId || Number.isNaN(userId)) {
      return response.status(400).json({ error: "User id is required" });
    }

    const createTaskService = new CreateTaskService();

    const task = await createTaskService.execute({
      title,
      description,
      user_id: userId,
    });

    return response.status(201).json(task);
  }

  async list(request: Request, response: Response) {
    const userId = Number(request.userId);

    if (!request.userId || Number.isNaN(userId)) {
      return response.status(400).json({
        error: "User id is required"
      });
    }

    const listTasksService = new ListTasksService();

    const tasks = await listTasksService.execute(userId);

    return response.json(tasks);
  }

  async show(request: Request, response: Response) {
    const taskId = Number(request.params.id);
    const userId = Number(request.userId);

    if (Number.isNaN(taskId)) {
      return response.status(400).json({
        error: "Invalid task id"
      });
    }

    const getTaskByIdService = new GetTaskByIdService();
    const task = await getTaskByIdService.execute(taskId);

    if (!task) {
      return response.status(404).json({
        error: "Task not found"
      });
    }

    if (task.user_id !== userId) {
      return response.status(403).json({
        error: "Access denied"
      });
    }

    return response.json(task);
  }

  async update(request: Request, response: Response) {
    const id = Number(request.params.id);
    const { title, description, completed } = request.body;

    const updateTaskService = new UpdateTaskService();
    const task = await updateTaskService.execute({
      id,
      title,
      description,
      completed,
    });

    return response.json(task);
  }

  async delete(request: Request, response: Response) {
    const id = Number(request.params.id);
    const userId = Number(request.userId);

    if (Number.isNaN(id)) {
      return response.status(400).json({ error: "Invalid task id" });
    }

    if (!request.userId || Number.isNaN(userId)) {
      return response.status(400).json({ error: "User id is required" });
    }

    const deleteTaskService = new DeleteTaskService();
    const task = await deleteTaskService.execute(id, userId);

    if (!task) {
      return response.status(404).json({ message: "Task não encontrada" });
    }

    return response.status(200).json({
      message: "Task removida com sucesso",
      task,
    });
  }

}