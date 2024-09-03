import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { TheaterService } from './theater.service';
import { ApiResponse } from '@nestjs/swagger';
import TheaterOutput from './output/theater.output';
import TheaterProviderData from './dtos/theaterProvider.dto';
import { Theater } from '../entities';
import { ZodValidationPipe } from '../validators/zod.validator';
import {
  searchTheaterSchema,
  SearchTheater,
} from './schemas/seachTheater.schema';
import { StandardResponse } from '@/types/apiResponse.type';

@Controller({
  path: '/api/theater',
})
export class TheaterController {
  constructor(private readonly service: TheaterService) {}

  @Get('/search')
  @UsePipes(new ZodValidationPipe(searchTheaterSchema))
  @ApiResponse({
    status: 200,
    description: 'Returns the list of theaters',
    type: TheaterOutput,
  })
  async searchTheater(
    @Query() searchQuery: SearchTheater,
  ): Promise<StandardResponse<TheaterProviderData[] | Theater[]>> {
    const providedTheater = await this.service.fetchProvider(searchQuery.name);

    // save theaters in database so that they can be used later
    if (
      Array.isArray(providedTheater) &&
      providedTheater.every((t) => 'entity_id' in t)
    ) {
      for (const provided of providedTheater) {
        this.service.saveTheater(provided);
      }
    }

    return {
      provided: providedTheater,
      message: 'Theaters fetched successfully',
      success: true,
    };
  }
}
