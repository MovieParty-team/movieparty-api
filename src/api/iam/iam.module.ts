import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/api/entities';
import { IamController } from './iam.controller';
import { IamService } from './iam.service';
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
  providers: [IamService],
})
export class IamModule {}
