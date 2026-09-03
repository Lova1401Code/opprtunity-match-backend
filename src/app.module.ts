import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';
import { OpportunitiesModule } from './modules/opportunities/opportunities.module';
import { ApplicationsModule } from './modules/applications/applications.module';
import { MatchingModule } from './modules/matching/matching.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    AuthModule,
    ProfileModule,
    OpportunitiesModule,
    ApplicationsModule,
    MatchingModule,
    DashboardModule,
  ],
  controllers: [AppController],
})
export class AppModule {}