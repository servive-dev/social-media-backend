import emailQueue from "./queues/email.queue.js";

await emailQueue.add(
   "welcomeEmail",
   {
      to: "test@gmail.com",
      subject: "Welcome To The Instagram"
   }
);

console.log("✅ Job added to queue")