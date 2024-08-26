import { Repository } from 'typeorm';
import { User } from '../entities';
import { AuthService } from './auth.service';

describe('AppController', () => {
  let authService: AuthService;

  let userRepo: Repository<User>;
  let userTest: User;

  beforeEach(async () => {
    userRepo = {
      findOneBy: jest.fn(),
      save: jest.fn(),
    } as any;

    authService = new AuthService(userRepo, {} as any);

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

    userRepo.save(userTest);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });
});
