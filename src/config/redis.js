import IORedis from "ioredis";
import logger from "../utils/logger.js";

const redis = new IORedis(process.env.REDIS_URL || "redis://127.0.0.1:6379", {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  retryStrategy(times) {
    return Math.min(times * 500, 5000);
  },
});

redis.on("connect", () => {
  logger.info("✅ Redis Connected");
});

redis.on("ready", () => {
  logger.info("🚀 Redis Ready");
});

redis.on("error", (err) => {
  logger.error(`❌ Redis Error: ${err.message}`);
});

export default redis;