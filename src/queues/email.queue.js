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
    },
});

console.log("Added JOB", emailQueue.status);

export const addEmailJob = async (data) => {
    console.log("DATA:", data);

    try {
        const job = await emailQueue.add(JOBS_NAMES.SEND_EMAIL, data, {
            jobId: `${data.type}-${data.to}-${Date.now()}`,
        });

        // console.log("JOB CREATED : ", job);
        console.log("JOB ID : ", job?.id);
        console.log("JOB ACTIVE:", await job.isActive());

        console.log("JOB COMPLETED:", await job.isCompleted());

        console.log("JOB FAILED:", await job.isFailed());

        console.log("JOB WAITING:", await job.isWaiting());

        return job; // 🔥 IMPORTANT
    } catch (err) {
        console.error("Queue add failed:", err);
        throw err;
    }
};

export default emailQueue;
