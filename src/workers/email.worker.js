import { Worker } from "bullmq";
import { bullMQConnection } from "../config/bullmq.config.js";

import { QUEUE_NAMES, QUEUE_STATES } from "../constants/queue.constant.js";
import { EMAIL_TYPES } from "../constants/email.constant.js";

import { sendEmail } from "../services/email.service.js";
import { welcomeTemplate } from "../templates/welcome.templete.js";
import { loginAlertTemplate } from "../templates/loginAlert.template.js";

import { deadLetterQueue } from "../queues/deadLetter.queue.js";
import { otpEmailTemplate } from "../templates/otpEmail.template.js";

console.log("👷 Worker started...");

const worker = new Worker(
    QUEUE_NAMES.EMAIL,

    async (job) => {
        console.log("📩 Processing:", job.data);

        const {
            type,
            to,
            username,
            deviceInfo,
            deviceType,
            loginMethod,
            ip,
            location,
            email,
            otp
        } = job.data;

        // 🔥 VALIDATION (IMPORTANT)
        if (!to || typeof to !== "string") {
            throw new Error(`Invalid email recipient: ${to}`);
        }

        console.log(job.data, "JOB DATA")

        switch (type) {
            case EMAIL_TYPES.WELCOME:
                try {
                    await sendEmail({
                        to,
                        subject: "Welcome 🚀",
                        html: welcomeTemplate({ username }),
                    });
                } catch (error) {
                    console.error("Welcome email failed:", error);
                    throw error;
                }
                break;

            case EMAIL_TYPES.LOGIN_ALERT:
                try {
                    await sendEmail({
                        to,
                        subject: "New Login Detected",
                        html: loginAlertTemplate({
                            username,
                            email,
                            deviceInfo,
                            deviceType,
                            loginMethod,
                            location,
                            ip,
                        }),
                    });
                } catch (error) {
                    console.error("Login email failed:", error);
                    throw error;
                }
                break;

            case EMAIL_TYPES.OTP_EMAIL:
                try {
                    await sendEmail({
                        to,
                        subject: "Send OTP On Email",
                        html: otpEmailTemplate({
                            username,
                            otp
                        })
                    });
                } catch (error) {
                    console.error("OTP email failed:", error);
                    throw error;
                }
                break;

            default:
                console.log("Unknown email type");
        }

        console.log("✅ EMAIL SENT SUCCESSFULLY:", job.id);
        return true;
    },

    {
        connection: bullMQConnection,
        concurrency: 1,
    }
);

worker.on(QUEUE_STATES.READY, () => {
    console.log("🚀 Worker ready");
});

worker.on(QUEUE_STATES.COMPLETED, (job) => {
    console.log(`✅ Job ${job.id} completed`);
});

worker.on(QUEUE_STATES.FAILED, (job, err) => {
    console.log(`❌ Job ${job.id} failed:`);

    deadLetterQueue
        .add("FAILED_EMAIL", {
            originalData: job.data,
            error: err.message,
        })
        .catch(console.error);
});

worker.on(QUEUE_STATES.ERROR, (err) => {
    console.error("🔥 Worker error:", err);
});

process.on("SIGINT", async () => {
    console.log("🛑 Shutting down worker...");
    await worker.close();
    process.exit(0);
});
