import { Repository } from 'typeorm';
import { IamController } from './iam.controller';
import { IamService } from './iam.service';
import { User } from '../entities';
import { RequestSession } from '@/types/iamRequest.type';

describe('Unit tests IAM', () => {
  let controller: IamController;
  let service: IamService;

  let userRepo: Repository<User>;
  let userTest: User;

  beforeEach(async () => {
    userRepo = {
      findOneBy: jest.fn(() => userTest),
      save: jest.fn(),
    } as any;

    service = new IamService(userRepo);
    controller = new IamController(service);

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

  /*
      Service Tests
  */

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return user when getting user by id', () => {
    expect(service.getUserById(userTest.id)).resolves.toEqual(userTest);
  });

  it('should return user when getting user by uuid', () => {
    expect(service.getUserByUuid(userTest.uuid)).resolves.toEqual(userTest);
  });

  it('should return user when getting user by username', () => {
    expect(service.getUserByUsername(userTest.username)).resolves.toEqual(
      userTest,
    );
  });

  it('should return user when getting user by email', () => {
    expect(service.getUserByEmail(userTest.email)).resolves.toEqual(userTest);
  });

  /*
      Controller Tests
  */

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return user when getting user by id', () => {
    expect(
      controller.getUser({ uuid: userTest.uuid }, {} as RequestSession),
    ).resolves.toEqual(userTest);
  });
});
