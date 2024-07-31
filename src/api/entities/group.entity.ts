import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Movie } from './movie.entity';
import { Theater } from './theater.entity';
import { User } from './user.entity';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Movie, (movie) => movie.groups)
  movie: Movie;

  @ManyToOne(() => Theater, (theater) => theater.groups)
  theater: Theater;

  @ManyToOne(() => User, (user) => user.groups)
  user: User;

  @Column()
  name: string;

  @Column()
  session_date: Date;
}
