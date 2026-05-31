import { TaskRepository } from "../repositories/TaskRepository";

export class ListTasksService {

  async execute(user_id: number) {

    const taskRepository = new TaskRepository();

    const tasks = await taskRepository.findByUser(
      user_id
    );

    return tasks;
  }

}