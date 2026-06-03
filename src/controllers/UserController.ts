import { Request, Response } from "express";
import { CreateUserService } from "../services/CreateUserService";
import { GetUserByIdService } from "../services/GetUserByIdService";
import { ListUsersService } from "../services/ListUsersService";
import { UpdateUserService } from "../services/UpdateUserService";
import { DeleteUserService } from "../services/DeleteUserService";
import { CreateUserSchema } from "../modules/users/dto/CreateUserDTO";
import { UpdateUserSchema } from "../modules/users/dto/UpdateUserDTO";
import { AppError } from "../shared/errors/AppError";

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

  async me(request: Request, response: Response) {
    if (!request.userId) {
      throw new AppError("User not authenticated", 401);
    }

    const userId = Number(request.userId);

    if (Number.isNaN(userId)) {
      throw new AppError("Invalid user id", 400);
    }

    const getUserByIdService = new GetUserByIdService();

    const user = await getUserByIdService.execute({ id: userId });

    return response.json(user);
  }

  async show(request: Request, response: Response) {
    const userId = Number(request.params.id);

    if (Number.isNaN(userId)) {
      throw new AppError("Invalid user id", 400);
    }

    const getUserByIdService = new GetUserByIdService();

    const user = await getUserByIdService.execute({ id: userId });

    return response.json(user);
  }

  async update(request: Request, response: Response) {
    const userId = Number(request.params.id);

    if (Number.isNaN(userId)) {
      throw new AppError("Invalid user id", 400);
    }

    const data = UpdateUserSchema.parse(request.body);

    const updateUserService = new UpdateUserService();

    const user = await updateUserService.execute({ id: userId, data });

    return response.json(user);
  }

  async delete(request: Request, response: Response) {
    const userId = Number(request.params.id);

    if (Number.isNaN(userId)) {
      throw new AppError("Invalid user id", 400);
    }

    const deleteUserService = new DeleteUserService();

    const deleted = await deleteUserService.execute({ id: userId });

    return response.status(200).json(deleted);
  }

  async list(request: Request, response: Response) {
    const listUsersService = new ListUsersService();

    const users = await listUsersService.execute();

    return response.json(users);
  }
}
