import {
    createPost,
    deletePost,
    getAllPosts,
    getPost,
    updatePost,
    updatePostStatus,
    updateSelectedOffer,
} from '#src/modules/post/post.controller.js';
import {
    validateCreatePost,
    validateUpdatePost,
    validateUpdatePostStatus,
    validateUpdateSelectedOffer,
} from '#src/modules/post/post.validator.js';
import express from 'express';

const router = express.Router();

router.route('/').get(getAllPosts).post(validateCreatePost, createPost);
router.route('/:id').get(getPost).patch(validateUpdatePost, updatePost).delete(deletePost);
router.patch('/:id/status', validateUpdatePostStatus, updatePostStatus);
router.patch('/:id/select-offer', validateUpdateSelectedOffer, updateSelectedOffer);

export default router;
