import { Repository } from 'typeorm';
import { User } from '../entities';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

describe('AppController', () => {
  let authService: AuthService;

  let userRepo: Repository<User>;
  let jwtService: JwtService;
  let userTest: User;

  beforeEach(async () => {
    userRepo = {
      findOneBy: jest.fn(() => userTest),
      save: jest.fn(() => userTest),
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

  it('should register user', async () => {
    userRepo.findOneBy = jest.fn(() => null);
    authService = new AuthService(userRepo, jwtService);

    const register = await authService.registerUser({
      email: userTest.email,
      username: userTest.username,
      password: userTest.password,
      firstname: userTest.firstname,
      lastname: userTest.lastname,
      birthday: userTest.birthday,
    });

    expect(register).toEqual({
      accessToken: 'token',
      refreshToken: 'token',
    });
  });

  it('should log in user', () => {
    expect(authService.loginUser(userTest)).resolves.toEqual({
      accessToken: 'token',
      refreshToken: 'token',
    });
  });
});
