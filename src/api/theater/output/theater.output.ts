import { ApiProperty } from '@nestjs/swagger';
import TheaterProviderData from '../dtos/theaterProvider.dto';
import { Theater } from '@/api/entities';

export class InternalTheater {
  @ApiProperty()
  id: number;

  @ApiProperty()
  provider_id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  zip: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  thumbnail: string;

  public static fromEntity(theater: Theater): InternalTheater {
    return {
      id: theater.id,
      provider_id: theater.provider_id,
      name: theater.name,
      city: theater.city,
      zip: theater.zip,
      address: theater.address,
      thumbnail: theater.thumbnail,
    };
  }
}

export default class TheaterOutput {
  @ApiProperty({
    type: () => [TheaterProviderData] || [InternalTheater],
  })
  data: TheaterProviderData[] | Theater[];
}
