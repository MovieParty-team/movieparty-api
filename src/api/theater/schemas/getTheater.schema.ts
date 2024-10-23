import { z } from 'zod';

export const getTheaterSchema = z.object({
  id: z.string(),
});

export type getTheater = z.infer<typeof getTheaterSchema>;
