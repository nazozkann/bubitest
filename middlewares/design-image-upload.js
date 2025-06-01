const multer = require('multer');
const uuid = require('uuid').v4;
const path = require('path');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'product-data/uploads'); // Dosyaların kaydedileceği klasör
    },
    filename: (req, file, cb) => {
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, uuid() + '-' + file.originalname);
    }
});

const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']; // Added 'image/webp'

const fileFilter = (req, file, cb) => {
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid mime type!'), false);
    }
};

module.exports = multer({
    storage: storage,
    fileFilter: fileFilter
});
