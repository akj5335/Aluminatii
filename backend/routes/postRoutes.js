import express from 'express';
const router = express.Router();
import postController from '../controllers/postController.js';
import auth from '../middleware/authMiddleware.js';

router.get('/', postController.getPosts);
router.post('/', auth, postController.createPost);
router.post('/:id/like', auth, postController.toggleLike);
router.post('/:id/comment', auth, postController.comment);

export default router;
