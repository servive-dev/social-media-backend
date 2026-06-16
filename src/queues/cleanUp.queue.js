import { Queue } from "bullmq";
import { bullMQConnection } from "../config/bullmq.config.js";
import { JOBS_NAMES, QUEUE_NAMES } from "../constants/queue.constant.js";

const cleanupQueue = new Queue(QUEUE_NAMES.CLEAN_UP, {
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
    },
});

export const addCleanUpJob = async ({ filepath, compressPath }) => {
    try {
        const job = await cleanupQueue.add(
            JOBS_NAMES.DELETE_FILE,
            { filepath, compressPath },
            { delay: 1 * 60 * 1000 }
        );

        console.log("JOB COMPLETED:", await job.isCompleted());
        console.log(`Cleanup job added: ${job.id}`);

        return job;
    } catch (error) {
        console.error("Queue add failed:", error);
        throw error;
    }
};
