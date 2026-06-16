import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === "avatar") {
            cb(null, "public/uploads/avatars");
        }

        if (file.fieldname === "post") {
            cb(null, "public/uploads/posts");
        }

        if (file.fieldname === "reel") {
            cb(null, "public/uploads/reels");
        }
    },

    filename: function (req, file, cb) {
        const date = new Date().toISOString().split("T")[0]; // --- 2026/06/13

        let uniqueName;
        if (file.fieldname === "avatar") {
            uniqueName =
                date + "-" + "avatar" + "-" + Math.round(Math.random() * 1e9);
        }

        if (file.fieldname === "post") {
            uniqueName =
                date + "-" + "post" + "-" + Math.round(Math.random() * 1e9);
        }

        if (file.fieldname === "reel") {
            uniqueName =
                date + "-" + "reel" + "-" + Math.round(Math.random() * 1e9);
        }

        cb(null, uniqueName + path.extname(file.originalname));
    },
});

// File Filter
const fileFilter = (req, file, cb) => {
    if (file.fieldname === "avatar") {
        const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only image files allowed"));
        }
    } else if (file.fieldname === "posts") {
        const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only image files allowed"));
        }
    } else if (file.fieldname === "reels") {
        const allowed = ["video/mp4", "video/quicktime"];

        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only video files allowed"));
        }
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 },
}); // Limit file size to 50MB
