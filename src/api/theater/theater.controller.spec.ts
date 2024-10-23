import { Repository } from 'typeorm';
import { TheaterController } from './theater.controller';
import { TheaterService } from './theater.service';
import { Theater, User, UserTheater } from '../../entities';
import TheaterProviderData from './dtos/theaterProvider.dto';

describe('Unit Tests Theater', () => {
  let controller: TheaterController;
  let service: TheaterService;

  let theaterRepo: Repository<Theater>;
  let userTheaterRepo: Repository<UserTheater>;
  let userRepo: Repository<User>;

  let theaterTest: Theater;
  let userTheaterTest: UserTheater;
  let userTest: User;

  beforeEach(async () => {
    theaterTest = {
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
      userTheaters: [],
      userGroups: [],
      groups: [],
    };

    userTheaterTest = {
      id: 1,
      user: userTest,
      theater: theaterTest,
    };

    theaterRepo = {
      findOneBy: jest.fn(() => theaterTest),
      save: jest.fn(() => theaterTest),
    } as any;

    userTheaterRepo = {
      findOneBy: jest.fn(() => userTheaterTest),
      save: jest.fn(),
      remove: jest.fn(() => Promise.resolve(null)),
    } as any;

    userRepo = {
      findOneBy: jest.fn(() => userTest),
      save: jest.fn(),
    } as any;

    // mock .catch() function in theaterRepo
    jest
      .spyOn(theaterRepo, 'save')
      .mockImplementation(() => Promise.resolve(theaterTest));

    service = new TheaterService(theaterRepo, userTheaterRepo, userRepo);
    controller = new TheaterController(service);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  /*
      Service Tests
  */

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // maybe avoid this one because it relies on provider API
  // it('should find a list of theaters', async () => {
  //   const result = await service.fetchProvider('paris');
  //   expect(result).toBeDefined();
  //   expect(result.length).toBeGreaterThan(0);
  // });

  it('should get theater by id', async () => {
    const result = await service.getById(1);
    expect(result).toBeDefined();
  });

  it('should get theater by provider id', async () => {
    const result = await service.getByProviderId('provider_id');
    expect(result).toBeDefined();
  });

  it('should save a new theater', async () => {
    theaterRepo.findOneBy = jest.fn();

    const theaterProvided: TheaterProviderData = {
      entity_id: 'provider_id',
      data: {
        city: 'city',
        address: 'address',
      },
    } as TheaterProviderData;

    const result = await service.saveTheater(theaterProvided);
    expect(result).toBeDefined();
  });

  it('should get favorite status', async () => {
    const result = await service.getFavoriteStatus('uuid', 'provider_id');
    expect(result).toBeDefined();
  });

  it('should remove favorite', async () => {
    await service.favoriteTheater('uuid', 'provider_id');
    expect(userTheaterRepo.remove).toHaveBeenCalled();
  });

  it('should add favorite', async () => {
    await service.favoriteTheater('uuid', 'provider_id');
    expect(userTheaterRepo.save).toBeDefined();
  });
});
