import {
    CREATE_POST,
    DELETE_POST,
    GET_ALL_POSTS,
    GET_POST,
    GET_USER_POSTS,
    SELECT_POST_OFFER,
    UPDATE_POST,
    UPDATE_POST_STATUS,
} from '#src/modules/post/endpoints.js';
import {
    createPost,
    deletePost,
    getAllPosts,
    getPost,
    getUserPosts,
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
import { isAuthorized } from '#src/shared/middlewares/authorization.middleware.js';
import express from 'express';

const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(isAuthorized(GET_ALL_POSTS), getAllPosts)
    .post(isAuthorized(CREATE_POST), validateCreatePost, createPost);
router
    .route('/:id')
    .get(isAuthorized(GET_POST), getPost)
    .patch(isAuthorized(UPDATE_POST), validateUpdatePost, updatePost)
    .delete(isAuthorized(DELETE_POST), deletePost);

router.get(
    '/me',
    isAuthorized(GET_USER_POSTS),

    getUserPosts
);

router.patch(
    '/:id/status',
    isAuthorized(UPDATE_POST_STATUS),
    validateUpdatePostStatus,
    updatePostStatus
);
router.patch(
    '/:id/select-offer',
    isAuthorized(SELECT_POST_OFFER),
    validateUpdateSelectedOffer,
    updateSelectedOffer
);

export default router;
