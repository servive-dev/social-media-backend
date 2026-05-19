import { Queue } from "bullmq";
import { bullMQConnection } from "../config/bullmq.config.js";
import { JOBS_NAMES, QUEUE_NAMES } from "../constants/queue.constant.js";


const emailQueue = new Queue(
   QUEUE_NAMES.EMAIL,
   {
      connection: bullMQConnection,
      defaultJobOptions: {
         attempts: 3,

         backoff: {
            type: "exponential",
            delay: 3000,
         },

         removeOnComplete: 1000,

         removeOnFail:5000,
      }
   }
);

export const addEmailJob = async (data) => {
   await emailQueue.add(
      JOBS_NAMES.SEND_EMAIL,
      data
   )
}

export default emailQueue;

