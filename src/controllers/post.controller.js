import { Post } from "../model/post.model.js"
import { sendNotification } from "../services/notification.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { NOTIFICATION_TYPES } from "../constants/notification.constant.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
 
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

// Upload media (image or reel)
export const uploadMedia = async (req, res) => {
    const { type } = req.body; 
    // type = "image" or "reel"

    if (!req.file) {
        throw new Error("File is required");
    }

    let resourceType = "image";
    let folder = "images";

    if (type === "reel") {
        resourceType = "video";
        folder = "reels";
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(
        req.file.buffer,
        folder,
        resourceType
    );

    // Reels validation (60 sec limit)
    if (type === "reel") {
        if (result.duration > 60) {
            throw new Error("Reel must be max 60 seconds");
        }
    }

    return res.status(200).json({
        success: true,
        url: result.secure_url,
        public_id: result.public_id,
        duration: result.duration || null
    });
};