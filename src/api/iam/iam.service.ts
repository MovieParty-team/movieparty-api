import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/api/entities';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class IamService {
  private readonly saltOrRounds: number;
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {
    this.saltOrRounds = 10;
  }

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

  async registerUser(newUser: {
    username: string;
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    birthday: Date;
  }): Promise<{ accessToken: string; refreshToken: string }> {
    const existingUser = await this.userRepo.findOneBy({
      email: newUser.email,
    });
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    newUser.password = await bcrypt.hash(newUser.password, this.saltOrRounds);

    const user = await this.userRepo.save(newUser);

    return {
      accessToken: await this.generateAccessToken(user),
      refreshToken: await this.generateRefreshToken(user),
    };
  }

  async loginUser({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepo.findOneBy({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      accessToken: await this.generateAccessToken(user),
      refreshToken: await this.generateRefreshToken(user),
    };
  }

  async logoutUser() {}

  private async generateAccessToken(user: User): Promise<string> {
    const payload = { sub: user.uuid };
    return await this.jwtService.signAsync(payload, {
      expiresIn: '60s',
    });
  }

  private async generateRefreshToken(user: User): Promise<string> {
    const payload = { sub: user.uuid };
    return await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
    });
  }

  async refreshTokenSet(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    return {
      accessToken: await this.generateAccessToken(user),
      refreshToken: await this.generateRefreshToken(user),
    };
  }
}
