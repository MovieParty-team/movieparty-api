import { ApiProperty } from '@nestjs/swagger';

export enum EntityType {
  THEATER = 'theater',
}

class TheaterData {
  @ApiProperty({
    type: String,
    description: 'The ID of the provider',
    example: 'D907',
  })
  id: string;

  @ApiProperty({
    type: String,
  })
  zip: string;

  @ApiProperty({
    type: String,
  })
  city: string;

  @ApiProperty({
    type: String,
  })
  address: string;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  country: null | string;

  @ApiProperty({
    type: String,
  })
  poster_path: string;

  @ApiProperty({
    type: String,
  })
  thumbnail: string;
}

class Scores {
  @ApiProperty({ type: Number })
  all_time_rank_score: number;
}

export default class TheaterProviderData {
  @ApiProperty({ enum: EntityType, enumName: 'EntityType' })
  entity_type: EntityType;

  @ApiProperty({
    type: String,
    description: 'The ID of the provider',
    example: 'D907',
  })
  entity_id: string;

  @ApiProperty({
    type: String,
  })
  gid: string;

  @ApiProperty({
    type: String,
  })
  label: string;

  @ApiProperty({
    type: String,
  })
  facet: string;

  @ApiProperty({
    type: String,
  })
  original_label: string;

  @ApiProperty({
    type: [String],
  })
  text_search_data: string[];

  @ApiProperty({
    type: Number,
  })
  status: number;

  @ApiProperty({
    type: Number,
  })
  viewcount: number;

  @ApiProperty({
    type: Number,
  })
  irankpopular: number;

  @ApiProperty({
    type: Boolean,
  })
  browsable: boolean;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  starts_at: string | null;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  ends_at: string | null;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  last_release: string | null;

  @ApiProperty({
    type: () => TheaterData,
  })
  data: TheaterData;

  @ApiProperty({
    type: () => Scores,
  })
  scores: Scores;

  @ApiProperty({
    type: [String],
  })
  genres: string[];

  @ApiProperty({
    type: [String],
  })
  tags: string[];

  @ApiProperty({
    type: String,
  })
  last_updated_at: string;

  @ApiProperty({
    type: String,
  })
  index: string;

  @ApiProperty({
    type: String,
  })
  type: string;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: Number,
  })
  score: number;

  @ApiProperty({
    type: Boolean,
  })
  sponsored: boolean;
}
