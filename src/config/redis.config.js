import { createClient } from 'redis';
import { REDIS_STATES } from '../constants/redis.constant.js';

const redisClient = createClient(
   {
      url: process.env.REDIS_URL
   }
);

   redisClient.on(REDIS_STATES.COMPLETED, () => {
      console.log("Redis Connected !!")
   });

   redisClient.on(REDIS_STATES.ERROR, (err) => {
      console.log("Redis : ", err)
   });

   await redisClient.connect();

export default redisClient;   