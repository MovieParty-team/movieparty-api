import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Movie } from './movie.entity';

@Entity()
export class UserMovie {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userMovies, { cascade: true })
  user: User;

  @ManyToOne(() => Movie, (movie) => movie.userMovies, { cascade: true })
  movie: Movie;
}
