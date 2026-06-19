import cloudinary from "../../config/cloudinary.js";
import { dateFormatter } from "../../utils/dateFormatter.util.js"

export const uploadToCloudinary = async (filePath, folder, resourceType, username) => {
   try {
     const publicId =  `avatar-${username}-${dateFormatter()}`;
 
     const result = await cloudinary.uploader.upload(filePath, {
         folder,
         resource_Type: resourceType,
         public_id: publicId,
     });
 
     return result;
   } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw error;    
   }
};

