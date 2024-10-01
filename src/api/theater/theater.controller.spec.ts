import { Repository } from 'typeorm';
import { TheaterController } from './theater.controller';
import { TheaterService } from './theater.service';
import { Theater } from '../entities';
import TheaterProviderData from './dtos/theaterProvider.dto';

describe('Unit Tests Theater', () => {
  let controller: TheaterController;
  let service: TheaterService;

  let theaterRepo: Repository<Theater>;

  let theaterTest: Theater;

  beforeEach(async () => {
    theaterRepo = {
      findOneBy: jest.fn(() => theaterTest),
      save: jest.fn(() => theaterTest),
    } as any;

    // mock .catch() function in theaterRepo
    jest
      .spyOn(theaterRepo, 'save')
      .mockImplementation(() => Promise.resolve(theaterTest));

    service = new TheaterService(theaterRepo);
    controller = new TheaterController(service);

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
});
