import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/entities';
import { CreateUserDto } from './dtos/createUser.dto';
import { UserCredentialsDto } from './dtos/userCredentials.dto';
import { JwtModule } from '@nestjs/jwt';
import { envConfig } from 'src/config/env.config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: envConfig.jwtSecret,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, CreateUserDto, UserCredentialsDto],
})
export class AuthModule {}
