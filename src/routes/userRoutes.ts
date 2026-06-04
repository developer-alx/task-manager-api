import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorize, ensureOwnerOrRole } from "../middlewares/authorize";

const userRoutes = Router();
const userController = new UserController();

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Criar usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 */
userRoutes.post("/users", userController.create);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Retorna o perfil do usuário autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil do usuário autenticado
 *       401:
 *         description: Token missing or invalid
 */
userRoutes.get("/users/me", authMiddleware, userController.me);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualiza os dados de um usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       400:
 *         description: Requisição inválida
 *       401:
 *         description: Token missing or invalid
 *       404:
 *         description: Usuário não encontrado
 */
userRoutes.put("/users/:id", authMiddleware, ensureOwnerOrRole('admin'), userController.update);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Listar usuários
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários
 */
userRoutes.get("/users", authMiddleware, authorize('admin'), userController.list);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Exclui um usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário excluído com sucesso
 *       401:
 *         description: Token missing or invalid
 *       404:
 *         description: Usuário não encontrado
 */
userRoutes.delete("/users/:id", authMiddleware, ensureOwnerOrRole('admin'), userController.delete);

export { userRoutes };