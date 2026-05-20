import { Queue } from "bullmq";
import { bullMQConnection } from "../config/bullmq.config.js";
import { JOBS_NAMES, QUEUE_NAMES } from "../constants/queue.constant.js";


const emailQueue = new Queue(QUEUE_NAMES.EMAIL, {
   connection: bullMQConnection,

   limiter: {
      max: 50,
      duration: 1000,
   },

   defaultJobOptions: {
      attempts: 5,

      backoff: {
         type: "exponential",
         delay: 3000,
      },

      removeOnComplete: {
         age: 3600,
         count: 1000,
      },

      removeOnFail: 5000,
   }
});

export const addEmailJob = async (data) => {
   try {
      await emailQueue.add(
         JOBS_NAMES.SEND_EMAIL,
         data,
         {
            jobId: `${data.type}-${data.to}-${data.username || "na"}`,
         }
      );
   } catch (err) {
      console.error("Queue add failed:", err);
   }
};

export default emailQueue;
