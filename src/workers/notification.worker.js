import { Worker } from "bullmq";
import { bullMQConnection } from "../config/bullmq.config.js";
import { QUEUE_NAMES } from "../constants/queue.constant.js";
import { NOTIFICATION_TYPES } from "../constants/notification.constant.js";
import { QUEUE_STATES } from "../constants/queue.constant.js";

console.log("👷 Notification Worker started...");

const worker = new Worker(
  QUEUE_NAMES.NOTIFICATION,

  async (job) => {
    
    console.log("📩 Notification Job:", job.data);

    const { type, toUserId, fromUserId, postId } = job.data;

     console.log("📩 Processing:", job.id);

   //  TODO: DB Save
   // TODO: await Notification.create({})

    switch (type) {
      case NOTIFICATION_TYPES.LIKE:
        console.log(`❤️ ${fromUserId} liked ${postId}`);
        break;

      case NOTIFICATION_TYPES.FOLLOW:
        console.log(`❤️ ${fromUserId} followed ${postId}`);
        break;

      case NOTIFICATION_TYPES.COMMENT:
        console.log(`❤️ ${fromUserId} comment ${postId}`);
        break;

      case NOTIFICATION_TYPES.MESSAGE:
        console.log(`❤️ ${fromUserId} message ${postId}`);
        break;
    
      default:
        console.log("Unknown Notification")
        break;
    }

    return true;
  },
  {
    connection: bullMQConnection,
    concurrency: 10,
  }
);

worker.on(QUEUE_STATES.COMPLETED, (job) => {
  console.log("✅ Notification done:", job.id);
});

worker.on(QUEUE_STATES.FAILED, (job, err) => {
  console.log("❌ Notification failed:", err.message);
});