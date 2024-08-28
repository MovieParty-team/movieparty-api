import { Repository } from 'typeorm';
import { User } from '../entities';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

describe('AppController', () => {
  let authService: AuthService;

  let userRepo: Repository<User>;
  let jwtService: JwtService;
  let userTest: User;

  beforeAll(async () => {
    userRepo = {
      findOneBy: jest.fn(),
      save: jest.fn(),
    } as any;

    jwtService = {
      signAsync: jest.fn(() => 'token'),
    } as any;

    authService = new AuthService(userRepo, jwtService);

    userTest = {
      id: 1,
      uuid: 'uuid',
      email: 'email',
      username: 'username',
      password: 'password',
      is_verified: true,
      is_admin: true,
      firstname: 'firstname',
      lastname: 'lastname',
      bio: 'bio',
      avatar: 'avatar',
      birthday: new Date(),
      userMovies: [],
      followers: [],
      following: [],
      userGroups: [],
      userTheaters: [],
      groups: [],
    };
  });

  /*
      Service Tests
  */

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should register user', () => {
    expect(
      authService.registerUser({
        email: userTest.email,
        password: userTest.password,
        firstname: userTest.firstname,
        lastname: userTest.lastname,
        username: userTest.username,
        birthday: userTest.birthday,
      }),
    )
      .resolves.toEqual(userTest)
      .catch((err) => console.log(err));
  });

  it('should log in user', () => {
    expect(
      authService.loginUser({
        email: userTest.email,
        password: userTest.password,
      }),
    )
      .resolves.toEqual({
        accessToken: 'token',
        refreshToken: 'token',
      })
      .catch((err) => console.log(err));
  });
});
