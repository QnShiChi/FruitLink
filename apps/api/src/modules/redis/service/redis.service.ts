export abstract class RedisService {
  abstract get(key: string): Promise<string | null>;
  abstract set(key: string, value: string, ttlSeconds?: number): Promise<void>;
  abstract del(key: string): Promise<void>;
  abstract incr(key: string): Promise<number>;
  abstract expire(key: string, ttlSeconds: number): Promise<void>;
}
