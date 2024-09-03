import { ApiProperty } from '@nestjs/swagger';
import TheaterProviderData from '../dtos/theaterProvider.dto';
import { Theater } from '@/api/entities';

export default class TheaterOutput {
  @ApiProperty({
    type: () => [TheaterProviderData] || [Theater],
  })
  data: TheaterProviderData[] | Theater[];
}
