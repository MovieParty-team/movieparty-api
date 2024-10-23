import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Put,
  Query,
  Req,
  UsePipes,
} from '@nestjs/common';
import { TheaterService } from './theater.service';
import { ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import TheaterOutput, { InternalTheater } from './output/theater.output';
import TheaterProviderData, { EntityType } from './dtos/theaterProvider.dto';
import { ZodValidationPipe } from '../../validators/zod.validator';
import {
  searchTheaterSchema,
  SearchTheater,
} from './schemas/seachTheater.schema';
import { StandardResponse } from '@/types/apiResponse.type';
import { Theater } from '../../entities';
import { getTheater, getTheaterSchema } from './schemas/getTheater.schema';
import { RequestSession } from '@/types/iamRequest.type';
import {
  getShowtimes,
  getShowtimesSchema,
} from './schemas/getShowTimes.schema';
import ShowTimesWithMovie from './dtos/showtimesProvider.dto';

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
      Logger.error(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/data/:id')
  @ApiResponse({
    status: 200,
    description: 'Returns theater data',
    type: InternalTheater,
  })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Theater id',
    example: 'C0159',
  })
  @UsePipes(new ZodValidationPipe(getTheaterSchema))
  async getTheater(
    @Param() theater: getTheater,
  ): Promise<StandardResponse<InternalTheater>> {
    try {
      const theaterData = await this.service.getByProviderId(theater.id);

      if (!theaterData)
        throw new HttpException('Theater not found', HttpStatus.NOT_FOUND);

      return {
        provided: theaterData,
        message: 'Theater data',
        success: true,
      };
    } catch (error) {
      Logger.error(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/showtimes/:theaterId/:day')
  @UsePipes(new ZodValidationPipe(getShowtimesSchema))
  @ApiResponse({
    status: 200,
    description: 'Returns showtimes',
    type: ShowTimesWithMovie,
  })
  @ApiParam({
    name: 'theaterId',
    type: String,
    required: true,
    description: 'Theater id',
    example: 'C0159',
  })
  @ApiParam({
    name: 'day',
    type: String,
    required: true,
    description: 'Theater id',
    example: '0',
  })
  async getShowtimes(
    @Param() showTimesQuery: getShowtimes,
  ): Promise<StandardResponse<ShowTimesWithMovie[]>> {
    try {
      const showtimes = await this.service.fetchProviderShowtimes(
        showTimesQuery.theaterId,
        showTimesQuery.day,
      );
      return {
        provided: showtimes,
        message: 'Showtimes fetched successfully',
        success: true,
      };
    } catch (error) {
      Logger.error(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/favorite/:id')
  @UsePipes(new ZodValidationPipe(getTheaterSchema))
  @ApiResponse({
    status: 200,
    description: 'Returns favorite status of a given theater',
  })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Theater id',
    example: 'C0159',
  })
  async getFavoriteStatus(
    @Req() request: RequestSession,
    @Param() theater: getTheater,
  ): Promise<StandardResponse<boolean>> {
    try {
      const favorite = await this.service.getFavoriteStatus(
        request.user,
        theater.id,
      );
      return {
        provided: favorite,
        message: 'Favorite status fetched successfully',
        success: true,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('/favorite/:id')
  @UsePipes(new ZodValidationPipe(getTheaterSchema))
  @ApiResponse({
    status: 200,
    description: 'Toggles favorite status of a given theater',
  })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Theater id',
    example: 'C0159',
  })
  async toggleFavorite(
    @Param() theater: getTheater,
    @Req() request: RequestSession,
  ): Promise<void> {
    try {
      await this.service.favoriteTheater(request.user, theater.id);
    } catch (error) {
      Logger.error(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
