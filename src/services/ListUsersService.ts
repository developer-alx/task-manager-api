import { UserRepository } from "../repositories/UserRepository";

export class ListUsersService {
  async execute() {
    const userRepository = new UserRepository();

    const users = await userRepository.findAll();

    return users.map((user: any) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    }));
  }
}
