import { UserRepository } from "../repositories/UserRepository";
import { AppError } from "../shared/errors/AppError";
import bcrypt from "bcrypt";


interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}

// regra de negócio.
export class CreateUserService {
  async execute({ name, email, password }: CreateUserDTO) {
    const userRepository = new UserRepository();

    const userAlreadyExists = await userRepository.findByEmail(email);

    if (userAlreadyExists) {
      throw new AppError("User already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10); // O valor 10 representa o salt rounds (nível de segurança do hash).

    const user = await userRepository.create({
      name,
      email,
      password: hashedPassword,
      role: "user"
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at
    };
  }
}
