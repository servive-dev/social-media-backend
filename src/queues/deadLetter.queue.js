import { Queue } from "bullmq";
import { bullMQConnection } from "../config/bullmq.config.js";

export const deadLetterQueue = new Queue("email-dlq", {
   connection: bullMQConnection,
});