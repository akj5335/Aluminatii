import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinaryConfig.js';
import { uploadProfilePhoto, uploadImage } from './controllers/uploadController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure multer for file upload
// Configure Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'aluminati_uploads',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }]
    }
});

const upload = multer({ storage: storage });

router.post('/photo', auth, upload.single('photo'), uploadProfilePhoto);
router.post('/image', auth, upload.single('image'), uploadImage); // Generic image upload
// Image serving is now handled by Cloudinary URLs directly

export default router;
