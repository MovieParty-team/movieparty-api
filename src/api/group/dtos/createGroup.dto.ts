import { ApiProperty } from '@nestjs/swagger';
import { CreateGroup } from '../schemas/createGroup.schema';

export class CreateGroupDto implements CreateGroup {
  @ApiProperty({
    example: 'toto',
  })
  movieId: string;

  @ApiProperty({
    example: 'tutu',
  })
  theaterId: string;

  @ApiProperty({
    example: '2022-01-01T00:00:00.000Z',
  })
  showtimeDate: string;
}
