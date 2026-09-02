import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";
import notificationProcessor from "./notification.processor.js";
import logger from "../logger.js";

const QUEUE_NOTIFICATION = "notif-jobs";

const createRedisConnection = () => {
  const conn = new IORedis(process.env.REDIS_URL || "redis://127.0.0.1:6379", {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    retryStrategy(times) {
      return Math.min(times * 500, 5000);
    },
  });
  conn.on("connect", () => logger.info("✅ Redis Connected"));
  conn.on("error", (err) => {
    if (err.message && err.message.includes("ETIMEDOUT")) {
      logger.warn(`⚠️ Redis connection timeout (retrying...): ${err.message}`);
    } else {
      logger.error(`❌ Redis Error: ${err.message}`);
    }
  });
  return conn;
};

class NotificationQueueService {
  constructor() {
    logger.info("🚀 Initializing Notification Queue...");

    this.queueRedis = createRedisConnection();
    this.workerRedis = createRedisConnection();

    this.queue = new Queue(QUEUE_NOTIFICATION, {
      connection: this.queueRedis,
      defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 50,
      },
    });

    this.queue.on("error", (err) => {
      if (err.message && err.message.includes("ETIMEDOUT")) {
        logger.warn(`⚠️ Notification Queue retry: ${err.message}`);
      } else {
        logger.error(`❌ Notification Queue error: ${err.message}`);
      }
    });

    this.worker = null;

    this.workerRedis.once("ready", () => {
      this._startWorker();
    });
  }

  _startWorker() {
    logger.info("🔧 Starting Notification Worker...");

    this.worker = new Worker(
      QUEUE_NOTIFICATION,
      async (job) => {
        logger.info(`📥 Worker picked Job ID: ${job.id}`);
        await notificationProcessor.handleNotificationJob(job.data);
      },
      {
        connection: this.workerRedis,
        concurrency: 3,
        drainDelay: 5,
        stalledInterval: 30000,
        maxStalledCount: 1,
      },
    );

    this.worker.on("completed", (job) => {
      logger.info(`✅ Notification Job ${job.id} completed`);
    });

    this.worker.on("failed", async (job, err) => {
      logger.error(`❌ Notification Job ${job.id} failed: ${err.message}`);
      if (job?.data?.logId) {
        await notificationProcessor.handleFailure(job.data.logId);
      }
    });

    this.worker.on("error", (err) => {
      if (err.message && err.message.includes("ETIMEDOUT")) {
        logger.warn(`⚠️ Worker connection retry: ${err.message}`);
      } else {
        logger.error(`❌ Worker error: ${err.message}`);
      }
    });

    logger.info("✅ Notification Worker Started");
  }

  async addNotificationJob(data, delay) {
    console.log("📤 Adding notification job to queue...");
    const options = {
      removeOnComplete: true,
      removeOnFail: true,
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5000,
      },
    };

    if (delay) {
      options.delay = delay;
      console.log(`⏳ Job scheduled with delay: ${delay}ms`);
    }

    const job = await this.queue.add("sendNotification", data, options);
    console.log(`🆔 Job added successfully. Job ID: ${job.id}`);

    return job;
  }
}

export default new NotificationQueueService();
