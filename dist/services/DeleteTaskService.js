"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteTaskService = void 0;
const TaskRepository_1 = require("../repositories/TaskRepository");
class DeleteTaskService {
    async execute(id, user_id) {
        const taskRepository = new TaskRepository_1.TaskRepository();
        const task = await taskRepository.findById(id);
        if (!task || task.user_id !== user_id) {
            return null;
        }
        return await taskRepository.delete(id, user_id);
    }
}
exports.DeleteTaskService = DeleteTaskService;
