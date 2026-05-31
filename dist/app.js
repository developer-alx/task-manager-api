"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const userRoutes_1 = require("./routes/userRoutes");
const authRoutes_1 = require("./routes/authRoutes");
const taskRoutes_1 = require("./routes/taskRoutes");
const errorHandler_1 = require("./shared/errors/errorHandler");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./shared/docs/swagger");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// rotas
app.use(userRoutes_1.userRoutes);
app.use(authRoutes_1.authRoutes);
app.use(taskRoutes_1.taskRoutes);
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
// middleware de erro (SEMPRE por último)
app.use(errorHandler_1.errorHandler);
exports.default = app;
