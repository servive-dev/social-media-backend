import { Worker } from "bullmq";
import { bullMQConnection } from "../config/bullmq.config.js";
import { QUEUE_NAMES, QUEUE_STATES } from "../constants/queue.constant.js";
import { EMAIL_TYPES } from "../constants/email.constant.js";
import { sendEmail } from "../services/email.service.js";
import { welcomeTemplate } from "../templates/welcome.templete.js";
import { loginAlertTemplate } from "../templates/loginAlert.template.js";

console.log("👷 Worker file loaded...");

const worker = new Worker(
    QUEUE_NAMES.EMAIL,
    async (job) => {

        console.log("📩 Processing Job:", job.data);

        const { type, to, username, device, browser, ipAddress } = job.data;

        switch (type) {
          case EMAIL_TYPES.WELCOME:
            await sendEmail(
              {
                to,

                subject: "Welcome 🚀",

                html: welcomeTemplate({username}),
              }
            );
            
            break;
        
          case EMAIL_TYPES.LOGIN_ALERT:
            await sendEmail(
              {
                to,

                subject: "New Login Detected",

                html: loginAlertTemplate(
                  {
                    username,
                    device,
                    browser,
                    ipAddress
                  }
                ),
              }
            );
            
            break;
        
          default:
            console.log("Unknown Email Type")
            break;
        }
      
       return true 

    },
    {
        connection: bullMQConnection,
        concurrency: 5,
    }
);

// ✅ lifecycle events
worker.on(QUEUE_STATES.READY, () => {
    console.log("🚀 Worker ready");
});

worker.on(QUEUE_STATES.WAITING, () => {
    console.log("🚀 Worker waiting");
});

worker.on(QUEUE_STATES.COMPLETED, (job) => {
    console.log(`✅ Job ${job.id} completed`);
});

worker.on(QUEUE_STATES.FAILED, (job, err) => {
    console.log(`❌ Job ${job.id} failed:`, err.message);
});

// 🔥 retry safety (global handler)
worker.on(QUEUE_STATES.ERROR, (err) => {
    console.error("🔥 Worker crashed:", err);
});

// 🧠 graceful shutdown (important in production)
process.on("SIGINT", async () => {
    console.log("🛑 Shutting down worker...");
    await worker.close();
    process.exit(0);
});
