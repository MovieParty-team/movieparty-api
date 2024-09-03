import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { Theater } from '../entities';
import { ILike, Repository } from 'typeorm';
import TheaterProviderData from './dtos/theaterProvider.dto';

@Injectable()
export class TheaterService {
  constructor(
    @InjectRepository(Theater) private theater: Repository<Theater>,
  ) {}

  async fetchProvider(
    searchQuery: string,
  ): Promise<TheaterProviderData[] | Theater[]> {
    const response = await fetch(
      `https://www.allocine.fr/_/autocomplete/mobile/theater/${searchQuery}`,
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

  async saveTheater(providedTheater: TheaterProviderData): Promise<Theater> {
    const existingTheater = await this.theater.findOneBy({
      provider_id: providedTheater.entity_id,
    });

    if (!existingTheater)
      return this.theater.save({
        provider_id: providedTheater.entity_id,
        name: providedTheater.label,
        city: providedTheater.data.city,
        address: providedTheater.data.address,
      });
  }
}
