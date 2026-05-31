import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { RefreshTokenService } from "../services/RefreshTokenService";

export class AuthController {
  async login(request: Request, response: Response) {
    const { email, password } = request.body;

    const service = new AuthService();

    const result = await service.execute({
      email,
      password,
    });

    return response.json(result);
  }
  async refreshToken(request: Request, response: Response) {
    const { refreshToken } = request.body;

    const service = new RefreshTokenService();

    const result = await service.execute(refreshToken);

    return response.json(result);
  }
}
