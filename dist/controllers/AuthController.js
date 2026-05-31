"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const AuthService_1 = require("../services/AuthService");
const RefreshTokenService_1 = require("../services/RefreshTokenService");
class AuthController {
    async login(request, response) {
        const { email, password } = request.body;
        const service = new AuthService_1.AuthService();
        const result = await service.execute({
            email,
            password,
        });
        return response.json(result);
    }
    async refreshToken(request, response) {
        const { refreshToken } = request.body;
        const service = new RefreshTokenService_1.RefreshTokenService();
        const result = await service.execute(refreshToken);
        return response.json(result);
    }
}
exports.AuthController = AuthController;
