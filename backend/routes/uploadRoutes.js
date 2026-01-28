import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadProfilePhoto, uploadImage } from './controllers/uploadController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Make sure this folder exists
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

router.post('/photo', auth, upload.single('photo'), uploadProfilePhoto);
router.post('/image', auth, upload.single('image'), uploadImage); // Generic image upload
router.get('/image/:filename', (req, res) => {
    // Optional: Serve images if not served statically from server.js
    // For now, assuming static serve in server.js, but let's keep it clean.
    // Actually, generic static serve is better.
});

export default router;
