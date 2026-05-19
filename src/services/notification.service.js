import { notificationQueue } from "../queues/notification.queue.js";
import { JOBS_NAMES } from "../constants/queue.constant.js"

export const sendNotification = async ({type, toUserId, fromUserId, postId = null }) => {

    await notificationQueue.add(
        JOBS_NAMES.SEND_NOTIFICATION,
        {
            type,
            toUserId,
            fromUserId,
            postId
        },
        {
            job_Id: `${type}-${fromUserId}-${postId}`
        }
    );
};
