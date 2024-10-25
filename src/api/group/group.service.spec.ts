import { Test, TestingModule } from '@nestjs/testing';
import { GroupService } from './group.service';
import { Group, Movie, Theater, User, UserGroup } from '@/entities';
import { Repository } from 'typeorm';

describe('GroupService', () => {
  let service: GroupService;

  let groupTest: Group;
  let userGroupTest: UserGroup;
  let userTest: User;
  let movieTest: Movie;
  let theaterTest: Theater;

  // repos
  let groupRepo: Repository<Group>;
  let userGroupRepo: Repository<UserGroup>;
  let userRepo: Repository<User>;
  let movieRepo: Repository<Movie>;
  let theaterRepo: Repository<Theater>;

  const mockUser: User = {
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
    userTheaters: [],
    followers: [],
    following: [],
    userGroups: [],
    groups: [],
  };

  const mockMovie: Movie = {
    id: 1,
    name: 'name',
    poster: 'thumbnail',
    synopsis: 'synopsis',
    genre: 'genre',
    casting: 'casting',
    userMovies: [],
    groups: [],
  };

  const mockTheater: Theater = {
    id: 1,
    provider_id: 'provider_id',
    name: 'name',
    city: 'city',
    address: 'address',
    zip: 'zip',
    thumbnail: 'thumbnail',
    userTheaters: [],
    groups: [],
  };

  const mockGroup: Group = {
    id: 1,
    name: 'name',
    session_date: new Date(),
    movie: null,
    theater: null,
    user: null,
    userGroups: [],
  };

  const mockUserGroup: UserGroup = {
    id: 1,
    user: null,
    group: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupService],
    }).compile();

    service = module.get<GroupService>(GroupService);

    userTest = mockUser;
    movieTest = mockMovie;
    theaterTest = mockTheater;

    groupTest = mockGroup;
    userGroupTest = mockUserGroup;

    jest
      .spyOn(groupRepo, 'save')
      .mockImplementation(() => Promise.resolve(groupTest));
    jest
      .spyOn(userGroupRepo, 'save')
      .mockImplementation(() => Promise.resolve(userGroupTest));
    jest
      .spyOn(userRepo, 'findOneBy')
      .mockImplementation(() => Promise.resolve(userTest));
    jest
      .spyOn(movieRepo, 'findOneBy')
      .mockImplementation(() => Promise.resolve(movieTest));
    jest
      .spyOn(theaterRepo, 'findOneBy')
      .mockImplementation(() => Promise.resolve(theaterTest));
    jest
      .spyOn(groupRepo, 'findOneBy')
      .mockImplementation(() => Promise.resolve(groupTest));
    jest
      .spyOn(userGroupRepo, 'findOneBy')
      .mockImplementation(() => Promise.resolve(userGroupTest));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a group', async () => {
    const result = await service.createGroup(
      userTest.uuid,
      theaterTest.provider_id,
      movieTest.id,
    );

    jest
      .spyOn(service, 'createGroup')
      .mockImplementation(() => Promise.resolve(groupTest));

    expect(result).toEqual(groupTest);
  });

  it('should get a group by id', async () => {
    const result = await service.getById(groupTest.id);

    jest
      .spyOn(service, 'getById')
      .mockImplementation(() => Promise.resolve(groupTest));

    expect(result).toEqual(groupTest);
  });

  it('should get a group by theater', async () => {
    const result = await service.getByTheater(theaterTest.provider_id);

    jest
      .spyOn(service, 'getByTheater')
      .mockImplementation(() => Promise.resolve(groupTest));

    expect(result).toEqual(groupTest);
  });

  it('should get all groups owned by a user', async () => {
    const result = await service.getGroupsByOwner(userTest.uuid);

    jest
      .spyOn(service, 'getGroupsByOwner')
      .mockImplementation(() => Promise.resolve([groupTest]));

    expect(result).toEqual([groupTest]);
  });

  it('should get all groups the user is a part of', async () => {
    const result = await service.getGroupsByUser(userTest.uuid);

    jest
      .spyOn(service, 'getGroupsByUser')
      .mockImplementation(() => Promise.resolve([groupTest]));

    expect(result).toEqual([groupTest]);
  });

  it('should update a group', async () => {
    const result = await service.updateGroup(groupTest.id, {
      name: 'new name',
    });

    jest
      .spyOn(service, 'updateGroup')
      .mockImplementation(() => Promise.resolve(groupTest));

    expect(result).toEqual(groupTest);
  });

  it('should delete a group', async () => {
    const result = await service.deleteGroup(groupTest.id);

    jest
      .spyOn(service, 'deleteGroup')
      .mockImplementation(() => Promise.resolve(groupTest));

    expect(result).toEqual(groupTest);
  });
});
