import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Theater } from '../entities';
import { TheaterController } from './theater.controller';
import { TheaterService } from './theater.service';

@Module({
  imports: [TypeOrmModule.forFeature([Theater])],
  controllers: [TheaterController],
  providers: [TheaterService],
})
export class TheaterModule {}
