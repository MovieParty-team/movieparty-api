import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/api/entities';
import { IamController } from './iam.controller';
import { IamService } from './iam.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [IamController],
  providers: [IamService],
})
export class IamModule {}
