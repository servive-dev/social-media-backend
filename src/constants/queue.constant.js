export const QUEUE_NAMES = {
   NOTIFICATION: "notificationQueue",
   EMAIL: "emailQueue",
   CLEAN_UP: "cleanupQueue"
}

export const JOBS_NAMES = {
   SEND_NOTIFICATION: "send-notification",
   SEND_EMAIL: "send-email",
   DELETE_FILE: "delete-file"
}

export const QUEUE_STATES = {
   PROCESSING: "processing",
   WAITING: "waiting",
   ACTIVE: "active",
   READY: "ready",
   PENDING: "pending",
   COMPLETED: "completed",
   FAILED: "failed",
   ERROR: "error"
}