import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = async (filePath, folder, resourceType) => {

    const result = await cloudinary.uploader.upload(filePath, {
        folder,
        resourceType,
    });

    return result;
};

// Delete file
export const deleteFromCloudinary = async (publicId, resourceType) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId, {
            resourceType,
        });
        console.log("Delete the file Succesfully : ------->>>> ", result)
        return result;
    } catch (error) {
        console.error("Cloudinary Delete Error:", error);

        throw error;
    }
};
