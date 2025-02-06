import { Repository } from 'typeorm';
import { User } from '../../entities';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { CreateUserDto } from './dtos/createUser.dto';
import { UserCredentialsDto } from './dtos/userCredentials.dto';

describe('Unit Tests Auth', () => {
  let authService: AuthService;
  let controller: AuthController;

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
    controller = new AuthController(
      authService,
      new CreateUserDto(),
      new UserCredentialsDto(),
    );

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

  it('should fail register user if user already exists', async () => {
    expect(authService.registerUser(userTest)).rejects.toBeTruthy();
  });

  // it('should log in user', () => {
  //   expect(
  //     authService.loginUser({
  //       email: userTest.email,
  //       password: bcrypt.hashSync(
  //         userTest.password,
  //         envConfig.brcyptSaltRounds,
  //       ),
  //     }),
  //   ).resolves.toEqual({
  //     accessToken: 'token',
  //     refreshToken: 'token',
  //   });
  // });

  it('should fail log in user if user does not exist', () => {
    expect(
      authService.loginUser({
        email: 'fail',
        password: 'fail',
      }),
    ).rejects.toThrow();
  });

  it('should refresh token', () => {
    expect(authService.refreshTokenSet(userTest)).resolves.toEqual({
      accessToken: 'token',
      refreshToken: 'token',
    });
  });

  /*
      Controller Tests
  */

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register user', () => {
    userRepo.findOneBy = jest.fn(() => null);
    authService = new AuthService(userRepo, jwtService);

    const mockResponse = {
      cookie: jest.fn(),
    } as any;

    const mockSession = {
      session: {
        accessToken: 'token',
        refreshToken: 'token',
        save: jest.fn(),
      },
    } as any;

    expect(
      controller.registerUser(
        {
          email: userTest.email,
          username: userTest.username,
          password: userTest.password,
          firstname: userTest.firstname,
          lastname: userTest.lastname,
          birthday: userTest.birthday.toDateString(),
          hydrate: jest.fn(() => {
            return {
              email: userTest.email,
              username: userTest.username,
              password: userTest.password,
              firstname: userTest.firstname,
              lastname: userTest.lastname,
              birthday: userTest.birthday,
            };
          }),
        },
        mockSession,
        mockResponse,
      ),
    );
  });
});
