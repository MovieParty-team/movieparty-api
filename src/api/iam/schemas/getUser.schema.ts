import { z } from 'zod';

export const getUserSchema = z.object({
  uuid: z.string(),
});

export type GetUser = z.infer<typeof getUserSchema>;
