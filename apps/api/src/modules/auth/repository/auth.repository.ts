import { Injectable } from '@nestjs/common';
import { RedisKeyConstant } from '../../../common/constants/redis-key.constant';
import { RedisService } from '../../redis/service/redis.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly redisService: RedisService) {}

  async saveRegisterOtp(email: string, otpCode: string, ttlSeconds: number) {
    await this.redisService.set(RedisKeyConstant.registerOtp(email), otpCode, ttlSeconds);
  }

  getRegisterOtp(email: string) {
    return this.redisService.get(RedisKeyConstant.registerOtp(email));
  }

  async clearRegisterOtp(email: string) {
    await this.redisService.del(RedisKeyConstant.registerOtp(email));
    await this.redisService.del(RedisKeyConstant.registerOtpAttempts(email));
  }

  async setRegisterOtpCooldown(email: string, ttlSeconds: number) {
    await this.redisService.set(RedisKeyConstant.registerOtpCooldown(email), '1', ttlSeconds);
  }

  getRegisterOtpCooldown(email: string) {
    return this.redisService.get(RedisKeyConstant.registerOtpCooldown(email));
  }

  async increaseRegisterOtpAttempts(email: string, ttlSeconds: number) {
    const attempts = await this.redisService.incr(RedisKeyConstant.registerOtpAttempts(email));
    await this.redisService.expire(RedisKeyConstant.registerOtpAttempts(email), ttlSeconds);
    return attempts;
  }
}
