import { Request, Response } from "express";
import { CreateUserService } from "../services/CreateUserService";
import { CreateUserSchema } from "../modules/users/dto/CreateUserDTO";

// Responsável por lidar com requisição HTTP.
export class UserController {
  async create(request: Request, response: Response) {
    const data = CreateUserSchema.parse(request.body);

    const createUserService = new CreateUserService();

    const user = await createUserService.execute(data);

    return response.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  async list(request: Request, response: Response) {
    const userId = request.userId;
    return response.json({ message: "Authenticated user", userId });
  }
}
