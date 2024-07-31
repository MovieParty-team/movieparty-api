import { CreateUser } from '../schemas/createUser.schema';
export class CreateUserDto implements CreateUser {
  email: string;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  birthday: string;

  hydrate(data: CreateUser) {
    return {
      email: data.email,
      username: data.username,
      password: data.password,
      firstname: data.firstname,
      lastname: data.lastname,
      birthday: new Date(data.birthday),
    };
  }
}
