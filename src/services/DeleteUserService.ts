import { UserRepository } from "../repositories/UserRepository";
import { AppError } from "../shared/errors/AppError";

interface DeleteUserServiceDTO {
  id: number;
  authenticatedUserId: number;
  authenticatedUserRole: string;
}

export class DeleteUserService {
  async execute({ id, authenticatedUserId, authenticatedUserRole }: DeleteUserServiceDTO) {
    // Checagem defensiva: verifica se é owner ou admin
    if (authenticatedUserRole !== "admin" && authenticatedUserId !== id) {
      throw new AppError("Permission denied", 403);
    }

    const userRepository = new UserRepository();

    const user = await userRepository.findById(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const deleted = await userRepository.delete(id);

    return deleted;
  }
}
