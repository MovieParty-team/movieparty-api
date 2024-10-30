import { Group } from '@/entities';

export class UpdateGroupDto implements Partial<Group> {
  name: string;
  description: string;
}
