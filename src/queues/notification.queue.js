import { Queue } from "bullmq";
import { QUEUE_NAMES } from "../constants/queue.constant.js";
import { bullMQConnection } from "../config/bullmq.config.js";


export const notificationQueue = new Queue(
  QUEUE_NAMES.NOTIFICATION,
  {
    connection: bullMQConnection,
    defaultJobOptions: {
      attempts: 3,

      backoff: {
        type: "exponential",
        delay: 3000
      },

      removeOnComplete: Number(
        process.env.QUEUE_REMOVE_ON_COMPLETE
      ),

      removeOnFail: Number(
        process.env.QUEUE_REMOVE_ON_FAIL
      ),
    },
  }

);