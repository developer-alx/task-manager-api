"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListUsersService = void 0;
const UserRepository_1 = require("../repositories/UserRepository");
class ListUsersService {
    async execute() {
        const userRepository = new UserRepository_1.UserRepository();
        const users = await userRepository.findAll();
        return users.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            created_at: user.created_at,
            updated_at: user.updated_at,
        }));
    }
}
exports.ListUsersService = ListUsersService;
