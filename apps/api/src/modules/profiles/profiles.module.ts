import { Module } from '@nestjs/common';
import { ProfilesController } from './controller/profiles.controller';
import { ProfilesRepository } from './repository/profiles.repository';
import { ProfilesService } from './service/profiles.service';
import { ProfilesServiceImpl } from './service/impl/profiles.service.impl';

@Module({
  controllers: [ProfilesController],
  providers: [
    ProfilesRepository,
    {
      provide: ProfilesService,
      useClass: ProfilesServiceImpl,
    },
  ],
  exports: [ProfilesRepository, ProfilesService],
})
export class ProfilesModule {}
