import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  UsePipes,
} from '@nestjs/common';
import { TheaterService } from './theater.service';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import TheaterOutput, { InternalTheater } from './output/theater.output';
import TheaterProviderData, { EntityType } from './dtos/theaterProvider.dto';
import { ZodValidationPipe } from '../validators/zod.validator';
import {
  searchTheaterSchema,
  SearchTheater,
} from './schemas/seachTheater.schema';
import { StandardResponse } from '@/types/apiResponse.type';
import { Theater } from '../entities';

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
  @ApiQuery({
    name: 'name',
    required: true,
    type: String,
  })
  async searchTheater(
    @Query() searchQuery: SearchTheater,
  ): Promise<StandardResponse<TheaterProviderData[] | InternalTheater[]>> {
    try {
      const providedTheater = await this.service.fetchProvider(
        searchQuery.name,
      );

      const theaters = [];

      // save theaters in database so that they can be used later
      if (
        Array.isArray(providedTheater) &&
        providedTheater.every(
          (t) =>
            'entity_id' in t &&
            'entity_type' in t &&
            t.entity_type === EntityType.THEATER,
        )
      ) {
        for (const provided of providedTheater as TheaterProviderData[]) {
          this.service.saveTheater(provided);
          theaters.push(provided);
        }
      } else {
        for (const provided of providedTheater as Theater[]) {
          theaters.push(InternalTheater.fromEntity(provided));
        }
      }

      return {
        provided: theaters,
        message: 'Theaters fetched successfully',
        success: true,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
