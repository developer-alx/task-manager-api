import { TaskRepository } from "../repositories/TaskRepository";

interface UpdateTaskDTO {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export class UpdateTaskService {

  async execute({
    id,
    title,
    description,
    completed,
  }: UpdateTaskDTO) {

    const taskRepository = new TaskRepository();

    const task = await taskRepository.update(
      id,
      title,
      description,
      completed
    );

    return task;
  }

}