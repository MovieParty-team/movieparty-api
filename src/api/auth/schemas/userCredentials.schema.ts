import { z } from 'zod';

export const userCredentialsSchema = z.object({
  email: z.string(),
  password: z.string(),
  accessFrom: z.string().optional(),
});

export type userCredentials = z.infer<typeof userCredentialsSchema>;
