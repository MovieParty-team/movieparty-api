import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserMovie } from './userMovie.entity';
import { Follows } from './follows.entity';
import { UserGroup } from './userGroup.entity';
import { UserTheater } from './userTheater.entity';
import { Group } from './group.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({
    default: false,
  })
  is_verified: boolean;

  @Column({
    default: false,
  })
  is_admin: boolean;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({
    nullable: true,
  })
  bio: string;

  @Column({
    nullable: true,
  })
  avatar: string;

  @Column()
  birthday: Date;

  @OneToMany(() => UserMovie, (userMovie) => userMovie.user)
  userMovies: UserMovie[];

  @OneToMany(() => Follows, (follows) => follows.user)
  followers: Follows[];

  @OneToMany(() => Follows, (follows) => follows.follower)
  following: Follows[];

  @OneToMany(() => UserGroup, (userGroup) => userGroup.user)
  userGroups: UserGroup[];

  @OneToMany(() => UserTheater, (userTheater) => userTheater.user)
  userTheaters: UserTheater[];

  @OneToMany(() => Group, (group) => group.user)
  groups: Group[];
}
