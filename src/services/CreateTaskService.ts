import { TaskRepository } from "../repositories/TaskRepository";

interface CreateTaskDTO {
  title: string;
  description?: string;
  user_id: number;
}

export class CreateTaskService {

  async execute({
    title,
    description,
    user_id,
  }: CreateTaskDTO) {

    const taskRepository = new TaskRepository();

    const task = await taskRepository.create({
      title,
      description,
      user_id,
    });

    return task;
  }

}