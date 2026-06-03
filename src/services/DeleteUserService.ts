import { UserRepository } from "../repositories/UserRepository";
import { AppError } from "../shared/errors/AppError";

interface DeleteUserServiceDTO {
  id: number;
}

export class DeleteUserService {
  async execute({ id }: DeleteUserServiceDTO) {
    const userRepository = new UserRepository();

    const user = await userRepository.findById(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const deleted = await userRepository.delete(id);

    return deleted;
  }
}
