import { ApiProperty } from '@nestjs/swagger';

export class GetUserDto {
  @ApiProperty({
    example: '3a3a3a3a-3a3a-3a3a-3a3a-3a3a3a3a3a3a',
    description: 'User UUID',
  })
  uuid: string;
}
