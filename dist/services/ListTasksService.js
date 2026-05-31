"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListTasksService = void 0;
const TaskRepository_1 = require("../repositories/TaskRepository");
class ListTasksService {
    async execute(user_id) {
        const taskRepository = new TaskRepository_1.TaskRepository();
        const tasks = await taskRepository.findByUser(user_id);
        return tasks;
    }
}
exports.ListTasksService = ListTasksService;
