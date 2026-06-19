import fs from "fs/promises";
import { uploadToCloudinary } from "../helper/cloudinary/uploadToCloudinary.js";
import { compressImg } from "../services/image.service.js";
import { addCleanUpJob } from "../queues/cleanUp.queue.js";

export const processImg = async (filepath, type) => {
    let compressPath;
    let uploadResult;

    try {
        compressPath = await compressImg(filepath, type);
        if (type === 'avatars') {
           uploadResult = await uploadToCloudinary(compressPath, "avatars", "image");
        }
        if (type === 'posts') {
           uploadResult = await uploadToCloudinary(compressPath, "posts", "image");
        }
        return uploadResult;
    } finally {
        await addCleanUpJob(
            { filepath, compressPath },
            { delay: 1 * 60 * 1000 }
        );
    }
};
