import { Test, TestingModule } from '@nestjs/testing';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Group, Movie, Theater, User, UserGroup } from '@/entities';
import { Repository } from 'typeorm';

describe('GroupController', () => {
  let controller: GroupController;

  beforeEach(async () => {
    const mockRepo = {
      save: jest.fn(),
      create: jest.fn(),
      remove: jest.fn(),
      findOneBy: jest.fn(),
      findBy: jest.fn(),
    };
    const groupRepo: Repository<Group> = mockRepo as any;
    const userGroupRepo: Repository<UserGroup> = mockRepo as any;
    const userRepo: Repository<User> = mockRepo as any;
    const movieRepo: Repository<Movie> = mockRepo as any;
    const theaterRepo: Repository<Theater> = mockRepo as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupController],
      providers: [
        GroupService,
        { provide: getRepositoryToken(Group), useValue: groupRepo },
        { provide: getRepositoryToken(UserGroup), useValue: userGroupRepo },
        { provide: getRepositoryToken(User), useValue: userRepo },
        { provide: getRepositoryToken(Movie), useValue: movieRepo },
        { provide: getRepositoryToken(Theater), useValue: theaterRepo },
      ],
    }).compile();

    controller = module.get<GroupController>(GroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
