import cloudinary from "../../config/cloudinary.js";

// Delete file
export const deleteFromCloudinary = async (
    publicId,
    resourceType
) => {
    try {
        if (!publicId) {
            return null;
        }

        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
        });

        if (result.result !== "ok") {
            throw new Error(
                `Cloudinary delete failed: ${result.result}`
            );
        }

        return result;
    } catch (error) {
        console.error("Cloudinary Delete Error:", error);
        throw error;
    }
};