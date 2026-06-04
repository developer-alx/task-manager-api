import { UserRepository } from "../repositories/UserRepository";
import { AppError } from "../shared/errors/AppError";
import { UpdateUserDTO } from "../modules/users/dto/UpdateUserDTO";

interface UpdateUserServiceDTO {
  id: number;
  data: UpdateUserDTO;
  authenticatedUserId: number;
  authenticatedUserRole: string;
}

export class UpdateUserService {
  async execute({ id, data, authenticatedUserId, authenticatedUserRole }: UpdateUserServiceDTO) {
    // Checagem defensiva: verifica se é owner ou admin
    if (authenticatedUserRole !== "admin" && authenticatedUserId !== id) {
      throw new AppError("Permission denied", 403);
    }

    const userRepository = new UserRepository();

    const user = await userRepository.findById(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const updatedUser = await userRepository.update(id, data);

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      created_at: updatedUser.created_at,
    };
  }
}
