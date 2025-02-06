import { z } from 'zod';

export const getShowtimesSchema = z.object({
  theaterId: z.string(),
  day: z.string(),
});

export type getShowtimes = z.infer<typeof getShowtimesSchema>;
