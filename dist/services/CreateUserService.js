"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserService = void 0;
const UserRepository_1 = require("../repositories/UserRepository");
const AppError_1 = require("../shared/errors/AppError");
const bcrypt_1 = __importDefault(require("bcrypt"));
// regra de negócio.
class CreateUserService {
    async execute({ name, email, password }) {
        const userRepository = new UserRepository_1.UserRepository();
        const userAlreadyExists = await userRepository.findByEmail(email);
        if (userAlreadyExists) {
            throw new AppError_1.AppError("User already exists", 409);
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10); // O valor 10 representa o salt rounds (nível de segurança do hash).
        const user = await userRepository.create({
            name,
            email,
            password: hashedPassword,
        });
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            created_at: user.created_at
        };
    }
}
exports.CreateUserService = CreateUserService;
