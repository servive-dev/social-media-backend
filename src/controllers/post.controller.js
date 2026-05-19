import { Post } from "../model/post.model.js"
import { sendNotification } from "../services/notification.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { NOTIFICATION_TYPES } from "../constants/notification.constant.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
 
export const likePost = asyncHandler( async ( req, res) => { 
   const userId = req.user.id;

   const postId = req.params.postId;

   const post = await Post.findById(postId);

   //TODO: Post like logic

   await sendNotification(
      {
         type: NOTIFICATION_TYPES.LIKE,
         toUserId: post.owner,
         fromUserId: userId,
         postId,
      }
   )

    return res
   .status(200)
   .json(
      new ApiResponse(
         200,
         newUser,
         "Send Notification Successfully",
      )
   )
})