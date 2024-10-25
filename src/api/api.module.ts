import { Module } from '@nestjs/common';
import { IamModule } from './iam/iam.module';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { TheaterModule } from './theater/theater.module';
import { APP_GUARD } from '@nestjs/core';
import { GroupModule } from './group/group.module';

@Module({
  imports: [IamModule, AuthModule, TheaterModule, GroupModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class ApiModule {}
