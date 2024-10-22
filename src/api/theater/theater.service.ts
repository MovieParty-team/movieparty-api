import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { Theater, User, UserTheater } from '../entities';
import { ILike, Repository } from 'typeorm';
import TheaterProviderData from './dtos/theaterProvider.dto';
import { envConfig } from '@/config/env.config';

@Injectable()
export class TheaterService {
  constructor(
    @InjectRepository(Theater) private theater: Repository<Theater>,
    @InjectRepository(UserTheater) private userTheater: Repository<UserTheater>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  /**
   * Fetches a list of theaters from the provider API using a search query. If the request fails, it falls back to a local search.
   * @param searchQuery The search query to send to the provider API.
   * @returns A list of theaters from the provider API, or a list of theaters from the local database if the request fails.
   */
  async fetchProvider(
    searchQuery: string,
  ): Promise<TheaterProviderData[] | Theater[]> {
    const response = await fetch(
      `${envConfig.providerApiUrl}/autocomplete/mobile/theater/${searchQuery}`,
    );

    if (response.status !== 200) {
      Logger.error('Error fetching from provider');
      return this.fallback(searchQuery);
    }

    const data = await response.json();

    if (!data || !data.results) {
      Logger.error('No results found');
      return [];
    }

    const results = data.results as TheaterProviderData[];
    return results;
  }

  /**
   * Fallback method to search the database for theaters based on the search query.
   * Searches for theaters with names, cities, or addresses similar to the search query.
   *
   * @param search - The search query to find matching theaters.
   * @returns A promise that resolves to an array of theaters matching the search query.
   */
  fallback(search: string): Promise<Theater[]> {
    return this.theater.find({
      where: [
        { name: ILike(`%${search}%`) },
        { city: ILike(`%${search}%`) },
        { address: ILike(`%${search}%`) },
      ],
      take: 10,
    });
  }

  async getById(id: number): Promise<Theater> {
    return this.theater.findOneBy({ id });
  }

  async getByProviderId(providerId: string): Promise<Theater> {
    return this.theater.findOneBy({ provider_id: providerId });
  }

  /**
   * Saves a theater based on the provided data from the theater provider.
   *
   * @param providedTheater The data of the theater provided by the theater provider.
   * @returns A Promise that resolves to the saved theater entity.
   */
  async saveTheater(providedTheater: TheaterProviderData): Promise<Theater> {
    const existingTheater = await this.theater.findOneBy({
      provider_id: providedTheater.entity_id,
    });

    if (!existingTheater)
      return this.theater
        .save({
          provider_id: providedTheater.entity_id,
          name: providedTheater.label,
          city: providedTheater.data.city,
          address: providedTheater.data.address,
          zip: providedTheater.data.zip,
          thumbnail: providedTheater.data.thumbnail,
        })
        .catch((error) => {
          Logger.error(error);
          return null;
        });
  }

  /**
   * Toggle a theater as a favorite for a user.
   *
   * If the user already has the theater as a favorite, it will be removed.
   * Otherwise, it will be added as a favorite.
   *
   * Throws if the user or theater is not found.
   *
   * @param userUuid The UUID of the user.
   * @param providerId The provider ID of the theater.
   */
  async favoriteTheater(userUuid: string, providerId: string) {
    const user = await this.userRepo.findOneBy({ uuid: userUuid });

    const theater = await this.theater.findOneBy({
      provider_id: providerId,
    });

    if (!user || !theater) {
      throw new Error('User or theater not found');
    }

    const existingTheater = await this.userTheater.findOneBy({
      user: user,
      theater: theater,
    });

    if (existingTheater) {
      // remove favorite
      await this.userTheater.remove(existingTheater);
    } else {
      // add favorite
      await this.userTheater.save({
        user: user,
        theater: theater,
      });
    }
  }

  async getFavoriteStatus(
    userUuid: string,
    providerId: string,
  ): Promise<boolean> {
    const user = await this.userRepo.findOneBy({ uuid: userUuid });
    const theater = await this.theater.findOneBy({
      provider_id: providerId,
    });

    if (!user || !theater) {
      throw new Error('User or theater not found');
    }

    const existingTheater = await this.userTheater.findOneBy({
      user: user,
      theater: theater,
    });

    return !!existingTheater;
  }

  async fetchProviderShowtimes(theaterId: string, day: string) {
    const response = await fetch(
      `${envConfig.providerApiUrl}/showtimes/theater-${theaterId}/d-${day}`,
    );

    if (response.status !== 200) {
      Logger.error('Error fetching from provider');
      //   return this.fallback(searchQuery);
    }

    const data = await response.json();

    if (!data || !data.results) {
      Logger.error('No results found');
      return [];
    }

    const results = data.results;
    return results;
  }
}
