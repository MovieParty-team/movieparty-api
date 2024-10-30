import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group, Movie, Theater, User, UserGroup } from '@/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Group, User, UserGroup, Movie, Theater])],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}
