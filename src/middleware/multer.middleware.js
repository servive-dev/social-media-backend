import multer from 'multer';
import path from 'path'

const storage = multer.diskStorage(
    {
        destination: function(req, file, cb){

            if (file.fieldname === 'avatar') {
                cb(null, "public/uploads/avatars");
            }

            if (file.fieldname === 'postImage') {
                cb(null, "public/uploads/posts");
            }

            if (file.fieldname === 'reelVideo') {
                cb(null, "public/uploads/reels");
            }
        },

        filename: function(req, file, cb) {
            const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9)
            cb(null, uniqueName + path.extname(file.originalname))
        }
    }
);

// File Filter
const fileFilter = (req, file, cb) => {

    if (file.fieldname === "avatar") {
        const allowed = ["image/jpeg", "image/png", "image/webp"];

        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only image files allowed"));
        }
    }

    else if (file.fieldname === "postImage") {
        const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only image files allowed"));
        }
    }

    else if (file.fieldname === "reelVideo") {
        const allowed = ["video/mp4", "video/quicktime"];

        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only video files allowed"));
        }
    }
};

export const upload = multer({ storage, fileFilter, limits: { fileSize: 50 * 1024 * 1024 } }); // Limit file size to 50MB
