import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health/health.controller';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { InvestmentsModule } from './modules/investments/investments.module';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './modules/redis/redis.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { AuditModule } from './modules/audit/audit.module';
import { MailModule } from './modules/mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    RedisModule,
    AuditModule,
    MailModule,
    AuthModule,
    UsersModule,
    ProfilesModule,
    ProjectsModule,
    InvestmentsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
