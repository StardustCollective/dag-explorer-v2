import { Redis } from "ioredis";

import { parseNumberOrDefault } from "@/utils";

let RedisPromise: Promise<Redis> | null = null;

export const getRedis = () => {
  if (!RedisPromise) {
    RedisPromise = (async () => {
      const redis = new Redis({
        host: process.env.REDIS_HOST,
        port: parseNumberOrDefault(process.env.REDIS_PORT, 6379),
      });

      await redis.ping();

      return redis;
    })();
  }

  return RedisPromise;
};
