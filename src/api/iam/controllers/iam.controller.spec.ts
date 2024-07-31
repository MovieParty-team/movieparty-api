import { Test, TestingModule } from '@nestjs/testing';
import { IamController } from './iam.controller';
import { IamService } from '../../../services/iam.service';
import { User } from '../../entities';
import { typeOrmTestingConfig } from '../../../config/orm.config';

describe('AppController', () => {
  let iamController: IamController;
  let iamService: IamService;

  let userTest: User;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [IamController],
      providers: [IamService],
      imports: [typeOrmTestingConfig()],
    }).compile();

    iamController = app.get<IamController>(IamController);

    iamService = app.get<IamService>(IamService);

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
      userMovies: [],
      followers: [],
      following: [],
      userGroups: [],
      userTheaters: [],
      groups: [],
    };
  });

  describe('iam service', () => {
    it('should return user when getting user by id', () => {
      jest
        .spyOn(iamService, 'getUserById')
        .mockImplementation(() => Promise.resolve(userTest));
      expect(iamService.getUserById(1)).resolves.toEqual(userTest);
    });

    it('should return user when getting user by uuid', () => {
      jest
        .spyOn(iamService, 'getUserById')
        .mockImplementation(() => Promise.resolve(userTest));
      expect(iamService.getUserByUuid('uuid')).resolves.toEqual(userTest);
    });

    it('should return user when getting user by username', () => {
      jest
        .spyOn(iamService, 'getUserByUsername')
        .mockImplementation(() => Promise.resolve(userTest));
      expect(iamService.getUserByUsername('username')).resolves.toEqual(
        userTest,
      );
    });

    it('should return user when getting user by email', () => {
      jest
        .spyOn(iamService, 'getUserByEmail')
        .mockImplementation(() => Promise.resolve(userTest));
      expect(iamService.getUserByEmail('email')).resolves.toEqual(userTest);
    });
  });
});
