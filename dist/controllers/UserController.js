"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const CreateUserService_1 = require("../services/CreateUserService");
const CreateUserDTO_1 = require("../modules/users/dto/CreateUserDTO");
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
    async list(request, response) {
        const userId = request.userId;
        return response.json({ message: "Authenticated user", userId });
    }
}
exports.UserController = UserController;
