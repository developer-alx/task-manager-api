import { z } from "zod";

export const UpdateUserSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
});

export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;
