import { redis } from "../config/redis.js";

export class CacheService {
  static async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key);
      return data as T | null;
    } catch (error) {
      console.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  static async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      if (ttl) {
        await redis.setex(key, ttl, JSON.stringify(value));
      } else {
        await redis.set(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`Cache set error for key ${key}:`, error);
    }
  }

  static async del(key: string | string[]): Promise<void> {
    try {
      if (Array.isArray(key)) {
        await redis.del(...key);
      } else {
        await redis.del(key);
      }
    } catch (error) {
      console.error(`Cache delete error for key ${key}:`, error);
    }
  }

  static async invalidatePattern(pattern: string): Promise<void> {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      console.error(`Cache pattern delete error for pattern ${pattern}:`, error);
    }
  }

  static async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`Cache exists error for key ${key}:`, error);
      return false;
    }
  }

  static async incr(key: string): Promise<number> {
    try {
      return await redis.incr(key);
    } catch (error) {
      console.error(`Cache incr error for key ${key}:`, error);
      return 0;
    }
  }

  static async expire(key: string, ttl: number): Promise<void> {
    try {
      await redis.expire(key, ttl);
    } catch (error) {
      console.error(`Cache expire error for key ${key}:`, error);
    }
  }

  static async zincrby(key: string, increment: number, member: string): Promise<void> {
    try {
      await redis.zincrby(key, increment, member);
    } catch (error) {
      console.error(`Cache zincrby error for key ${key}:`, error);
    }
  }

  static async zrevrange(key: string, start: number, stop: number): Promise<string[]> {
    try {
      const result = await redis.zrange(key, start, stop, { rev: true });
      return result as string[];
    } catch (error) {
      console.error(`Cache zrevrange error for key ${key}:`, error);
      return [];
    }
  }

  static async hset(key: string, field: string, value: any): Promise<void> {
    try {
      await redis.hset(key, { [field]: JSON.stringify(value) });
    } catch (error) {
      console.error(`Cache hset error for key ${key}:`, error);
    }
  }

  static async hget(key: string, field: string): Promise<any> {
    try {
      const data = await redis.hget(key, field);
      return data ? JSON.parse(data as string) : null;
    } catch (error) {
      console.error(`Cache hget error for key ${key}:`, error);
      return null;
    }
  }

  static async hgetall(key: string): Promise<Record<string, any>> {
    try {
      const data = await redis.hgetall(key);
      if (!data) return {};
      const result: Record<string, any> = {};
      for (const [field, value] of Object.entries(data)) {
        try {
          result[field] = JSON.parse(value as string);
        } catch {
          result[field] = value;
        }
      }
      return result;
    } catch (error) {
      console.error(`Cache hgetall error for key ${key}:`, error);
      return {};
    }
  }

  static async hdel(key: string, field: string): Promise<void> {
    try {
      await redis.hdel(key, field);
    } catch (error) {
      console.error(`Cache hdel error for key ${key}:`, error);
    }
  }
}
