import z from 'zod';

export const getGroupSchema = z.object({
  id: z.number(),
});

export type GetGroup = z.infer<typeof getGroupSchema>;
