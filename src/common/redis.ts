import { Redis } from "ioredis";

import { parseNumberOrDefault } from "@/utils";

let RedisPromise: Promise<Redis> | null = null;

export const getRedis = () => {
  if (!RedisPromise) {
    RedisPromise = (async () => {
      const redis = new Redis({
        host: process.env.REDIS_HOST,
        port: parseNumberOrDefault(process.env.REDIS_PORT, 6379),
        connectTimeout: 10 * 1000,
        commandTimeout: 60 * 1000,
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
          if (times > 3) {
            return null;
          }
          return Math.min(times * 50, 2000);
        },
      });

      await redis.ping();

      return redis;
    })();
  }

  return RedisPromise;
};
