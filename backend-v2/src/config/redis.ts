import { Redis } from '@upstash/redis';

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error('Redis configuration missing');
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export const CACHE_TTL = {
  CATEGORIES: 3600,
  PRODUCTS: 300,
  PRODUCT_SINGLE: 600,
  CART: 1800,
  SESSION: 10800,
  TRENDING: 1800,
  SEARCH: 600,
} as const;
