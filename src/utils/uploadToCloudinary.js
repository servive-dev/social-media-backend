import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = async (
    filePath, 
    folder, 
    resourceType = "image"
) => {

    const result = await cloudinary.uploader.upload(filePath, {
        folder,
        resource_type: resourceType
    });

    return result;
};


// Delete file
export const deleteFromCloudinary = async (
    publicId,
    resourceType = "image" 
) => {
    try {

        const result = await cloudinary.uploader.destroy(
            publicId,
            {
                resource_type: resourceType,
            }
        );

        return result;

    } catch (error) {

        console.error("Cloudinary Delete Error:", error);

        throw error;
    }
};