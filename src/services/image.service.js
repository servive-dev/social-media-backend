import sharp from "sharp";
import path from "path";

export const compressImg = async (inputPath, type) => {

   const outerpath = path.join(
      `public/uploads/${type}`,
      `${type}-${Date.now()}.webp`
   );

   await sharp(inputPath)
   .resize(300, 300)
   .webp(
      {
         quality: 90
      }
   )
   .toFile(outerpath);

   return outerpath;

}

export const compressPostImage = async (inputPath) => {

   const outerpath = path.join(
      "public/uploads/compressed",
      `post-${Date.now()}.webp`
   );

   await sharp(inputPath)
   .resize(
      {
         width: 1080,
         withoutEnlargement: true
      }
   )
   .webp(
      {
         quality: 85
      }
   )
   .toFile(outerpath);

   return outerpath;

}