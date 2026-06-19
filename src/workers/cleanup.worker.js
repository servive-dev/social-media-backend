import fs from "fs/promises"
import { Worker } from "bullmq";
import { QUEUE_NAMES, QUEUE_STATES } from "../constants/queue.constant.js";
import { ApiError } from "../utils/ApiError.util.js";
import { bullMQConnection } from "../config/bullmq.config.js";
import { deadLetterQueue } from "../queues/deadLetter.queue.js"

const cleanupWorker = new Worker(
    QUEUE_NAMES.CLEAN_UP,
    async (job) => {
        const { filepath, compressPath } = job.data;

        if (!filepath || !compressPath) {
            throw new ApiError(400, "Cannot found the path url to unlink")
        }
        try {
            console.log("START TO UNLINK ")
            await fs.unlink(filepath).catch(() => {});
            console.log("UNLINK COMPLETED 1")
            
            if (compressPath) {
                await fs.unlink(compressPath).catch(() => {});
                 console.log("UNLINK COMPLETED 2")
            }
        console.log(
            `🗑️ Cleanup completed for ${filepath}`
        );
            console.log("Files deleted successfully");
            
        } catch (error) {
            console.error("Cleanup failed:", error);

            throw error;
        }
    },
    {
        connection: bullMQConnection,
        concurrency: 1,
    }
);

cleanupWorker.on(QUEUE_STATES.READY, () => {
    console.log("🚀 Worker ready");
});


cleanupWorker.on(QUEUE_STATES.COMPLETED, (job) => {
    console.log(`✅ Job ${job.id} completed`);
});

cleanupWorker.on(QUEUE_STATES.FAILED, (job, err) => {
    console.log(`❌ Job ${job.id} failed:`);

    deadLetterQueue
        .add("FAILED_EMAIL", {
            originalData: job.data,
            error: err.message,
        })
        .catch(console.error);
});

cleanupWorker.on(QUEUE_STATES.ERROR, (err) => {
    console.error("🔥 Worker error:", err);
});

process.on("SIGINT", async () => {
    console.log("🛑 Shutting down worker...");
    await worker.close();
    process.exit(0);
});