import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Theater } from './theater.entity';

@Entity()
export class UserTheater {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userTheaters, { cascade: true })
  user: User;

  @ManyToOne(() => Theater, (theater) => theater.userTheaters, {
    cascade: true,
  })
  theater: Theater;
}
