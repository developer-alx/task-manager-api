import { TaskRepository } from "../repositories/TaskRepository";

export class DeleteTaskService {

  async execute(id: number, user_id: number) {
    const taskRepository = new TaskRepository();

    const task = await taskRepository.findById(id);

    if (!task || task.user_id !== user_id) {
      return null;
    }

    return await taskRepository.delete(id, user_id);
  }

}