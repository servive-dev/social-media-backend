import { QueueEvents } from "bullmq"
import { bullMQConnection } from "../config/bullmq.config.js"
import { QUEUE_NAMES } from "../constants/queue.constant.js"
import { QUEUE_STATES } from "../constants/queue.constant.js";

export const queueEvent = new QueueEvents(
   QUEUE_NAMES.NOTIFICATION,
   {
      connection: bullMQConnection
   }
);

queueEvent.on(QUEUE_STATES.COMPLETED, ({jobId}) => {
   console.log("EVENT COMPLETED")
});

queueEvent.on(QUEUE_STATES.FAILED, ({jobId}) => {
   console.log("EVENT FAILED")
});