import { Module } from '@nestjs/common';
import { UsersController } from './controller/users.controller';
import { UsersRepository } from './repository/users.repository';
import { UsersService } from './service/users.service';
import { UsersServiceImpl } from './service/impl/users.service.impl';

@Module({
  controllers: [UsersController],
  providers: [
    UsersRepository,
    {
      provide: UsersService,
      useClass: UsersServiceImpl,
    },
  ],
  exports: [UsersRepository, UsersService],
})
export class UsersModule {}
