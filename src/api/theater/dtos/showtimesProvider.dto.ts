import { ApiProperty } from '@nestjs/swagger';

class PersonAppearanceStats {
  @ApiProperty()
  __typename: string;

  @ApiProperty()
  totalMovies: number;

  @ApiProperty()
  totalSeries: number;
}

class InternalImage {
  @ApiProperty()
  __typename: string;

  @ApiProperty()
  id: string;

  @ApiProperty()
  internalId: number;

  @ApiProperty()
  url: string;

  @ApiProperty()
  path: string;
}

class Seo {
  @ApiProperty()
  __typename: string;

  @ApiProperty()
  browsable: boolean;
}

class Person {
  @ApiProperty()
  __typename: string;

  @ApiProperty()
  internalId: number;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty({ type: Seo })
  seo: Seo;

  @ApiProperty({ type: InternalImage, nullable: true })
  picture: InternalImage | null;

  @ApiProperty({ type: PersonAppearanceStats })
  appearanceStats: PersonAppearanceStats;
}

class Position {
  @ApiProperty()
  __typename: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  department: string;
}

class Credit {
  @ApiProperty({ type: Person })
  person: Person;

  @ApiProperty({ type: Position })
  position: Position;

  @ApiProperty()
  rank: number;
}

class PartialDate {
  @ApiProperty()
  __typename: string;

  @ApiProperty()
  date: string;

  @ApiProperty()
  precision: string;
}

class ReleaseTags {
  @ApiProperty()
  tagTypes: string[];

  @ApiProperty({ nullable: true })
  tagFlags: string[] | null;
}

class MovieRelease {
  @ApiProperty({ type: PartialDate })
  releaseDate: PartialDate;

  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true })
  certificate: string | null;

  @ApiProperty({ nullable: true })
  advice: string | null;

  @ApiProperty({ nullable: true })
  companyLimitation: string | null;

  @ApiProperty({ type: ReleaseTags })
  releaseTags: ReleaseTags;

  @ApiProperty()
  visaNumber: string;
}

class Metric {
  @ApiProperty()
  hits: number;

  @ApiProperty()
  sessions: number;
}

class UserRating {
  @ApiProperty()
  score: number;

  @ApiProperty()
  count: number;
}

class Stats {
  @ApiProperty({ type: UserRating })
  userRating: UserRating;

  @ApiProperty()
  userReview: { count: number };

  @ApiProperty({ nullable: true })
  pressReview: any | null;

  @ApiProperty({ type: Metric })
  metric: Metric;

  @ApiProperty()
  wantToSeeCount: number;
}

class SeoData {
  @ApiProperty()
  __typename: string;

  @ApiProperty()
  browsable: boolean;

  @ApiProperty({ nullable: true })
  title: string | null;
}

class MovieData {
  @ApiProperty()
  __typename: string;

  @ApiProperty({ type: SeoData })
  seo: SeoData;

  @ApiProperty()
  productionYear: number;
}

class Genre {
  @ApiProperty()
  id: number;

  @ApiProperty()
  translate: string;

  @ApiProperty()
  tag: string;
}

class MoviePoster {
  @ApiProperty()
  __typename: string;

  @ApiProperty()
  id: string;

  @ApiProperty()
  internalId: number;

  @ApiProperty()
  url: string;

  @ApiProperty()
  path: string;
}

export class ProvidedMovie {
  @ApiProperty()
  __typename: string;

  @ApiProperty()
  internalId: number;

  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  originalTitle: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  runtime: string;

  @ApiProperty({ type: [Genre] })
  genres: Genre[];

  @ApiProperty({ type: [String] })
  languages: string[];

  @ApiProperty({ type: MovieData })
  data: MovieData;

  @ApiProperty({ type: Stats })
  stats: Stats;

  @ApiProperty({ type: [MovieRelease] })
  releases: MovieRelease[];

  @ApiProperty({ type: [Credit] })
  credits: Credit[];

  @ApiProperty({ type: MoviePoster })
  poster: MoviePoster;

  @ApiProperty()
  synopsis: string;

  @ApiProperty({ nullable: true })
  synopsisFull: string | null;

  @ApiProperty({ type: [String] })
  countries: string[];
}

class Showtime {
  @ApiProperty()
  __typename: string;

  @ApiProperty()
  internalId: number;

  @ApiProperty()
  startsAt: string;

  @ApiProperty()
  timeBeforeStart: string;

  @ApiProperty()
  isPreview: boolean;

  @ApiProperty()
  isWeeklyMovieOuting: boolean;

  @ApiProperty()
  diffusionVersion: string;
}

class Showtimes {
  @ApiProperty({ type: [Showtime] })
  local: Showtime[];

  @ApiProperty({ type: [Showtime] })
  multiple: Showtime[];
}

export default class ShowTimesWithMovie {
  @ApiProperty({ type: ProvidedMovie })
  movie: ProvidedMovie;

  @ApiProperty({ type: Showtimes })
  showtimes: Showtimes;
}
