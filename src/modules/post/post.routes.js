import {
    createPost,
    deletePost,
    getAllPosts,
    getPost,
    updatePost,
    updatePostStatus,
    updateSelectedOffer,
} from '#src/modules/post/post.controller.js';
import express from 'express';

const router = express.Router();

router.route('/').get(getAllPosts).post(createPost);
router.route('/:id').get(getPost).patch(updatePost).delete(deletePost);
router.patch('/:id/status', updatePostStatus);
router.patch('/:id/select-offer', updateSelectedOffer);

export default router;
