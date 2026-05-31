"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const CreateTaskService_1 = require("../services/CreateTaskService");
const ListTasksService_1 = require("../services/ListTasksService");
const GetTaskByIdService_1 = require("../services/GetTaskByIdService");
const UpdateTaskService_1 = require("../services/UpdateTaskService");
const DeleteTaskService_1 = require("../services/DeleteTaskService");
class TaskController {
    async create(request, response) {
        const { title, description } = request.body;
        const userId = Number(request.userId);
        if (!request.userId || Number.isNaN(userId)) {
            return response.status(400).json({ error: "User id is required" });
        }
        const createTaskService = new CreateTaskService_1.CreateTaskService();
        const task = await createTaskService.execute({
            title,
            description,
            user_id: userId,
        });
        return response.status(201).json(task);
    }
    async list(request, response) {
        const userId = Number(request.userId);
        if (!request.userId || Number.isNaN(userId)) {
            return response.status(400).json({
                error: "User id is required"
            });
        }
        const listTasksService = new ListTasksService_1.ListTasksService();
        const tasks = await listTasksService.execute(userId);
        return response.json(tasks);
    }
    async show(request, response) {
        const taskId = Number(request.params.id);
        const userId = Number(request.userId);
        if (Number.isNaN(taskId)) {
            return response.status(400).json({
                error: "Invalid task id"
            });
        }
        const getTaskByIdService = new GetTaskByIdService_1.GetTaskByIdService();
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
    async update(request, response) {
        const id = Number(request.params.id);
        const { title, description, completed } = request.body;
        const updateTaskService = new UpdateTaskService_1.UpdateTaskService();
        const task = await updateTaskService.execute({
            id,
            title,
            description,
            completed,
        });
        return response.json(task);
    }
    async delete(request, response) {
        const id = Number(request.params.id);
        const userId = Number(request.userId);
        if (Number.isNaN(id)) {
            return response.status(400).json({ error: "Invalid task id" });
        }
        if (!request.userId || Number.isNaN(userId)) {
            return response.status(400).json({ error: "User id is required" });
        }
        const deleteTaskService = new DeleteTaskService_1.DeleteTaskService();
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
exports.TaskController = TaskController;
