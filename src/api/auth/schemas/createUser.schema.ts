import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string(),
  username: z.string(),
  password: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  birthday: z.string(),
  accessFrom: z.string().optional(),
});

export type CreateUser = z.infer<typeof createUserSchema>;
