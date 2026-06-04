import { UserRepository } from "../repositories/UserRepository";
import { AppError } from "../shared/errors/AppError";
import { UpdateUserDTO } from "../modules/users/dto/UpdateUserDTO";

interface UpdateUserServiceDTO {
  id: number;
  data: UpdateUserDTO;
}

export class UpdateUserService {
  async execute({ id, data }: UpdateUserServiceDTO) {
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
