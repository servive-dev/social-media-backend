import IORedis from "ioredis"
import { REDIS_STATES } from "../constants/redis.constant.js";

export const bullMQConnection = new IORedis(
   {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,

      maxRetriesPerRequest: null
   }
);

bullMQConnection.on(REDIS_STATES.COMPLETED, () => {
  console.log("✅ BullMQ Redis Connected");
});

bullMQConnection.on(REDIS_STATES.ERROR, (err) => {
  console.log("❌ BullMQ Redis Error:", err.message);
});