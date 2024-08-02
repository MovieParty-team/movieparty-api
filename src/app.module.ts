import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dataSourceOptions } from './config/orm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IamModule } from './api/iam/iam.module';
import { AuthGuard } from './api/iam/auth.guard';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), IamModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
