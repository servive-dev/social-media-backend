import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/jpg', 'image/heic', 'image/heif', 'image/avif', 'video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv', 'video/webm', 'video/3gpp', 'video/3gpp2', 'video/x-flv', 'video/x-matroska', 'video/x-mpegURL', 'video/x-ms-asf'
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Unsupported file type'), false);
    }

};

export const upload = multer({ storage, fileFilter, limits: { fileSize: 50 * 1024 * 1024 } }); // Limit file size to 50MB
