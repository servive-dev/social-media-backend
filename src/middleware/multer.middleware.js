import multer from "multer";
import path from "path";
import fs from "fs";
import { generateResetToken } from "../utils/token.util.js";

const UPLOAD_CONFIG = {
    avatar: {
        folder: "public/uploads/avatars",
        mime: ["image/jpeg", "image/png", "image/webp"]
    },
    post: {
        folder: "public/uploads/posts",
        mime: ["image/jpeg", "image/png", "image/webp"]
    },
    reel: {
        folder: "public/uploads/reels",
        mime: ["video/mp4", "video/quicktime"]
    }
};

// Auto create folders
Object.values(UPLOAD_CONFIG).forEach((cfg) => {
    fs.mkdirSync(cfg.folder, { recursive: true });
});

const date = new Date().toISOString().split("T")[0]; // --- 2026/06/13

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const config = UPLOAD_CONFIG[file.fieldname];
        if (!config) return cb(new Error("Invalid field"));
        cb(null, config.folder);
    },

    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const unique = generateResetToken(12);

        cb(null, `${file.fieldname}-${date}-${unique}${ext}`);
    }
});


// FILTER
const fileFilter = (req, file, cb) => {
    const config = UPLOAD_CONFIG[file.fieldname];
    if (!config) return cb(new Error("Invalid field"));

    if (!config.mime.includes(file.mimetype)) {
        return cb(new Error("Invalid file type"));
    }

    cb(null, true);
};

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 }
});