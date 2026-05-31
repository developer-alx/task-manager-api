import { TaskRepository } from "../repositories/TaskRepository";

export class GetTaskByIdService {

  async execute(id: number) {

    const taskRepository = new TaskRepository();

    const task = await taskRepository.findById(id);

    return task;
  }

}