import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controller/auth.controller';
import { AuthRepository } from './repository/auth.repository';
import { AuthService } from './service/auth.service';
import { AuthServiceImpl } from './service/impl/auth.service.impl';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';

const jwtExpiresIn = (process.env.JWT_EXPIRES_IN ?? '1d') as unknown as never;

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'fruitlink-secret-key',
      signOptions: {
        expiresIn: jwtExpiresIn,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthRepository,
    JwtStrategy,
    {
      provide: AuthService,
      useClass: AuthServiceImpl,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
