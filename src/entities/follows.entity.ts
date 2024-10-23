import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Follows {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.following, { cascade: true })
  user: User;

  @ManyToOne(() => User, (user) => user.followers, { cascade: true })
  follower: User;
}
