import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserMovie } from './userMovie.entity';
import { Group } from './group.entity';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  poster: string;

  @Column()
  synopsis: string;

  @Column()
  genre: string;

  @Column()
  casting: string;

  @OneToMany(() => UserMovie, (userMovie) => userMovie.movie)
  userMovies: UserMovie[];

  @OneToMany(() => Group, (group) => group.movie)
  groups: Group[];
}
