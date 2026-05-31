"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTaskService = void 0;
const TaskRepository_1 = require("../repositories/TaskRepository");
class UpdateTaskService {
    async execute({ id, title, description, completed, }) {
        const taskRepository = new TaskRepository_1.TaskRepository();
        const task = await taskRepository.update(id, title, description, completed);
        return task;
    }
}
exports.UpdateTaskService = UpdateTaskService;
