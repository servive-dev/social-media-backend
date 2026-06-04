import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = async (fileBuffer, folder, resourceType = "image") => {
    const base64 = fileBuffer.toString("base64");

    const dataUri = `data:${resourceType === "video" ? "video/mp4" : "image/jpeg"};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
        folder,
        resource_type: resourceType
    });

    return result;
};