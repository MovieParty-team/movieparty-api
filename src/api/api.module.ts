import { Module } from '@nestjs/common';
import { IamModule } from './iam/iam.module';
import { AuthGuard } from './iam/auth.guard';

@Module({
  imports: [IamModule],
  controllers: [],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
  ],
})
export class ApiModule {}
