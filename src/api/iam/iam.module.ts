import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities';
import { IamController } from './iam.controller';
import { IamService } from './iam.service';
import { CreateUserDto } from './dtos/createUser.dto';
import { UserCredentialsDto } from './dtos/userCredentials.dto';
import { JwtModule } from '@nestjs/jwt';
import { envConfig } from 'src/config/env.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: envConfig.jwtSecret,
    }),
  ],
  controllers: [IamController],
  providers: [IamService, CreateUserDto, UserCredentialsDto],
})
export class IamModule {}
