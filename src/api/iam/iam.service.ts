import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/entities';

@Injectable()
export class IamService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async getUserById(id: number): Promise<User> {
    return this.userRepo.findOneBy({ id });
  }

  async getUserByUuid(uuid: string): Promise<User> {
    return this.userRepo.findOneBy({ uuid });
  }

  async getUserByUsername(username: string): Promise<User> {
    return this.userRepo.findOneBy({ username });
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.userRepo.findOneBy({ email });
  }
}
