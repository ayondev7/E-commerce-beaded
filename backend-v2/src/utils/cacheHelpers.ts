import { CacheService } from "./cacheService.js";
import { CACHE_TTL } from "../config/redis.js";

export class CategoryCache {
  private static prefix = "category";

  static async getAll() {
    return CacheService.get(`${this.prefix}:all`);
  }

  static async setAll(categories: any) {
    await CacheService.set(`${this.prefix}:all`, categories, CACHE_TTL.CATEGORIES);
  }

  static async getById(id: string) {
    return CacheService.get(`${this.prefix}:${id}`);
  }

  static async setById(id: string, category: any) {
    await CacheService.set(`${this.prefix}:${id}`, category, CACHE_TTL.CATEGORIES);
  }

  static async invalidate() {
    await CacheService.invalidatePattern(`${this.prefix}:*`);
  }

  static async invalidateById(id: string) {
    await CacheService.del(`${this.prefix}:${id}`);
    await CacheService.del(`${this.prefix}:all`);
  }
}

export class ProductCache {
  private static prefix = "product";

  static async getList(key: string) {
    return CacheService.get(`${this.prefix}:list:${key}`);
  }

  static async setList(key: string, data: any) {
    await CacheService.set(`${this.prefix}:list:${key}`, data, CACHE_TTL.PRODUCTS);
  }

  static async getBySlug(slug: string) {
    return CacheService.get(`${this.prefix}:slug:${slug}`);
  }

  static async setBySlug(slug: string, product: any) {
    await CacheService.set(`${this.prefix}:slug:${slug}`, product, CACHE_TTL.PRODUCT_SINGLE);
  }

  static async invalidate() {
    await CacheService.invalidatePattern(`${this.prefix}:*`);
  }

  static async invalidateBySlug(slug: string) {
    await CacheService.del(`${this.prefix}:slug:${slug}`);
  }

  static async invalidateLists() {
    await CacheService.invalidatePattern(`${this.prefix}:list:*`);
  }

  static async trackView(productId: string) {
    await CacheService.zincrby("trending:products", 1, productId);
  }

  static async getTrending(limit: number = 10) {
    return CacheService.zrevrange("trending:products", 0, limit - 1);
  }
}

export class CartCache {
  private static prefix = "cart";

  static async get(customerId: string) {
    return CacheService.hgetall(`${this.prefix}:${customerId}`);
  }

  static async set(customerId: string, field: string, value: any) {
    await CacheService.hset(`${this.prefix}:${customerId}`, field, value);
    await CacheService.expire(`${this.prefix}:${customerId}`, CACHE_TTL.CART);
  }

  static async invalidate(customerId: string) {
    await CacheService.del(`${this.prefix}:${customerId}`);
  }

  static async getField(customerId: string, field: string) {
    return CacheService.hget(`${this.prefix}:${customerId}`, field);
  }

  static async deleteField(customerId: string, field: string) {
    await CacheService.hdel(`${this.prefix}:${customerId}`, field);
  }
}

export class SessionCache {
  private static prefix = "session";

  static async get(userId: string) {
    return CacheService.get(`${this.prefix}:${userId}`);
  }

  static async set(userId: string, userData: any) {
    await CacheService.set(`${this.prefix}:${userId}`, userData, CACHE_TTL.SESSION);
  }

  static async invalidate(userId: string) {
    await CacheService.del(`${this.prefix}:${userId}`);
  }
}

export class SearchCache {
  private static prefix = "search";

  static buildKey(query: string, filters: any): string {
    const filterStr = JSON.stringify(filters);
    return `${this.prefix}:${query}:${filterStr}`;
  }

  static async get(key: string) {
    return CacheService.get(key);
  }

  static async set(key: string, results: any) {
    await CacheService.set(key, results, CACHE_TTL.SEARCH);
  }

  static async invalidate() {
    await CacheService.invalidatePattern(`${this.prefix}:*`);
  }
}

export class OrderCache {
  private static prefix = "order";

  static async get(orderId: string, customerId: string) {
    return CacheService.get(`${this.prefix}:${orderId}:${customerId}`);
  }

  static async set(orderId: string, customerId: string, order: any) {
    await CacheService.set(`${this.prefix}:${orderId}:${customerId}`, order, 300);
  }

  static async invalidate(orderId: string, customerId: string) {
    await CacheService.del(`${this.prefix}:${orderId}:${customerId}`);
  }

  static async invalidateUserOrders(customerId: string) {
    await CacheService.invalidatePattern(`${this.prefix}:*:${customerId}`);
  }

  static async setStatus(orderId: string, status: string) {
    await CacheService.set(`${this.prefix}:status:${orderId}`, status, 600);
  }

  static async getStatus(orderId: string) {
    return CacheService.get(`${this.prefix}:status:${orderId}`);
  }
}
