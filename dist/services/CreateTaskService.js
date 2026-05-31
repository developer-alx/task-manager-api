"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTaskService = void 0;
const TaskRepository_1 = require("../repositories/TaskRepository");
class CreateTaskService {
    async execute({ title, description, user_id, }) {
        const taskRepository = new TaskRepository_1.TaskRepository();
        const task = await taskRepository.create({
            title,
            description,
            user_id,
        });
        return task;
    }
}
exports.CreateTaskService = CreateTaskService;
