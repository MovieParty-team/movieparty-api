import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserTheater } from './userTheater.entity';
import { Group } from './group.entity';

@Entity()
export class Theater {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  provider_id: string;

  @Column()
  name: string;

  @Column()
  city: string;

  @Column()
  address: string;

  @OneToMany(() => UserTheater, (userTheater) => userTheater.theater)
  userTheaters: UserTheater[];

  @OneToMany(() => Group, (group) => group.theater)
  groups: Group[];
}
