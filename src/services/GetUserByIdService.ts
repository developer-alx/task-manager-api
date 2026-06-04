import { UserRepository } from "../repositories/UserRepository";
import { AppError } from "../shared/errors/AppError";

interface GetUserByIdDTO {
  id: number;
}

export class GetUserByIdService {
  async execute({ id }: GetUserByIdDTO) {
    const userRepository = new UserRepository();

    const user = await userRepository.findById(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    };
  }
}
