import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Theater, User, UserTheater } from '../../entities';
import { TheaterController } from './theater.controller';
import { TheaterService } from './theater.service';

@Module({
  imports: [TypeOrmModule.forFeature([Theater, User, UserTheater])],
  controllers: [TheaterController],
  providers: [TheaterService],
})
export class TheaterModule {}
