import z from 'zod';

export const updateGroupSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export type UpdateGroupDto = z.infer<typeof updateGroupSchema>;
