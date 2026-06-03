"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserSchema = void 0;
const zod_1 = require("zod");
exports.UpdateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(3).optional(),
    email: zod_1.z.string().email().optional(),
});
