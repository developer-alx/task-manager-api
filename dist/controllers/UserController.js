"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const CreateUserService_1 = require("../services/CreateUserService");
const GetUserByIdService_1 = require("../services/GetUserByIdService");
const ListUsersService_1 = require("../services/ListUsersService");
const UpdateUserService_1 = require("../services/UpdateUserService");
const DeleteUserService_1 = require("../services/DeleteUserService");
const CreateUserDTO_1 = require("../modules/users/dto/CreateUserDTO");
const UpdateUserDTO_1 = require("../modules/users/dto/UpdateUserDTO");
const AppError_1 = require("../shared/errors/AppError");
// Responsável por lidar com requisição HTTP.
class UserController {
    async create(request, response) {
        const data = CreateUserDTO_1.CreateUserSchema.parse(request.body);
        const createUserService = new CreateUserService_1.CreateUserService();
        const user = await createUserService.execute(data);
        return response.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
        });
    }
    async me(request, response) {
        if (!request.userId) {
            throw new AppError_1.AppError("User not authenticated", 401);
        }
        const userId = Number(request.userId);
        if (Number.isNaN(userId)) {
            throw new AppError_1.AppError("Invalid user id", 400);
        }
        const getUserByIdService = new GetUserByIdService_1.GetUserByIdService();
        const user = await getUserByIdService.execute({ id: userId });
        return response.json(user);
    }
    async show(request, response) {
        const userId = Number(request.params.id);
        if (Number.isNaN(userId)) {
            throw new AppError_1.AppError("Invalid user id", 400);
        }
        const getUserByIdService = new GetUserByIdService_1.GetUserByIdService();
        const user = await getUserByIdService.execute({ id: userId });
        return response.json(user);
    }
    async update(request, response) {
        const userId = Number(request.params.id);
        if (Number.isNaN(userId)) {
            throw new AppError_1.AppError("Invalid user id", 400);
        }
        if (!request.userId) {
            throw new AppError_1.AppError("User not authenticated", 401);
        }
        const data = UpdateUserDTO_1.UpdateUserSchema.parse(request.body);
        const updateUserService = new UpdateUserService_1.UpdateUserService();
        const user = await updateUserService.execute({
            id: userId,
            data,
            authenticatedUserId: Number(request.userId),
            authenticatedUserRole: request.userRole || "user"
        });
        return response.json(user);
    }
    async delete(request, response) {
        const userId = Number(request.params.id);
        if (Number.isNaN(userId)) {
            throw new AppError_1.AppError("Invalid user id", 400);
        }
        if (!request.userId) {
            throw new AppError_1.AppError("User not authenticated", 401);
        }
        const deleteUserService = new DeleteUserService_1.DeleteUserService();
        const deleted = await deleteUserService.execute({
            id: userId,
            authenticatedUserId: Number(request.userId),
            authenticatedUserRole: request.userRole || "user"
        });
        return response.status(200).json(deleted);
    }
    async list(request, response) {
        const listUsersService = new ListUsersService_1.ListUsersService();
        const users = await listUsersService.execute();
        return response.json(users);
    }
}
exports.UserController = UserController;
