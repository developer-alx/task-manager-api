import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { loginRateLimit } from "../middlewares/rateLimit";


const authRoutes = Router();
const authController = new AuthController();

authRoutes.post("/login",  loginRateLimit, authController.login);
authRoutes.post("/refresh-token", authController.refreshToken);


export { authRoutes };