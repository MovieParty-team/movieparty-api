import { ApiProperty } from '@nestjs/swagger';
import { userCredentials } from '../schemas/userCredentials.schema';

export class UserCredentialsDto implements userCredentials {
  @ApiProperty({
    example: 'email@example.com',
  })
  email: string;

  @ApiProperty({
    example: 'password',
  })
  password: string;

  hydrate(data: userCredentials) {
    return {
      email: data.email,
      password: data.password,
    };
  }
}
