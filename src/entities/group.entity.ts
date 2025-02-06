import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Movie } from './movie.entity';
import { Theater } from './theater.entity';
import { User } from './user.entity';
import { UserGroup } from './userGroup.entity';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Movie, (movie) => movie.groups, {
    cascade: true,
  })
  movie: Movie;

  @ManyToOne(() => Theater, (theater) => theater.groups, {
    cascade: true,
  })
  theater: Theater;

  @ManyToOne(() => User, (user) => user.groups, {
    cascade: true,
  })
  user: User;

  @OneToMany(() => UserGroup, (userGroup) => userGroup.group)
  userGroups: UserGroup[];

  @Column()
  name: string;

  @Column()
  session_date: Date;
}
