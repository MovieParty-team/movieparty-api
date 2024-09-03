import { z } from 'zod';

export const searchTheaterSchema = z.object({
  name: z.string(),
});

export type SearchTheater = z.infer<typeof searchTheaterSchema>;
