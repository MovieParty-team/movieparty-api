import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './config/orm.config';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), ApiModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
