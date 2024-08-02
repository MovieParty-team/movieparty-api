import { userCredentials } from '../schemas/userCredentials.schema';

export class UserCredentialsDto implements userCredentials {
  email: string;
  password: string;

  hydrate(data: userCredentials) {
    return {
      email: data.email,
      password: data.password,
    };
  }
}
