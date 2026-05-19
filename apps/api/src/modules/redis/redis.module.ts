import { Global, Module } from '@nestjs/common';
import { RedisService } from './service/redis.service';
import { RedisServiceImpl } from './service/impl/redis.service.impl';

@Global()
@Module({
  providers: [
    {
      provide: RedisService,
      useClass: RedisServiceImpl,
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
