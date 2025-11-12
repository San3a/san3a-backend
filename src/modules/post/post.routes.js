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
import { setPostBody, setUserIdToParams } from '#src/modules/post/post.middleware.js';
import {
    validateCreatePost,
    validateUpdatePost,
    validateUpdatePostStatus,
    validateUpdateSelectedOffer,
} from '#src/modules/post/post.validator.js';
import Post from '#src/modules/post/post.model.js';
import { isAuthorized } from '#src/shared/middlewares/authorization.middleware.js';
import restrictToOwner from '#src/shared/middlewares/check-owner.middleware.js';
import express from 'express';
import offerRoutes from '../offer/offer.routes.js';

const router = express.Router({ mergeParams: true });

router.use('/:id/offers', offerRoutes);

router
    .route('/')
    .get(isAuthorized(GET_ALL_POSTS), getAllPosts)
    .post(isAuthorized(CREATE_POST), validateCreatePost, setPostBody, createPost);

router.get('/me', isAuthorized(GET_USER_POSTS), setUserIdToParams, getUserPosts);
router
    .route('/:id')
    .get(isAuthorized(GET_POST), getPost)
    .patch(
        isAuthorized(UPDATE_POST),
        restrictToOwner(Post, 'user', "You don't have the permission to update this post"),
        validateUpdatePost,
        updatePost
    )
    .delete(
        isAuthorized(DELETE_POST),
        restrictToOwner(Post, 'user', "You don't have the permission to delete this post"),
        deletePost
    );

router.patch(
    '/:id/status',
    isAuthorized(UPDATE_POST_STATUS),
    restrictToOwner(
        Post,
        'user',
        "You don't have the permission to update the status of this post"
    ),
    validateUpdatePostStatus,
    updatePostStatus
);
router.patch(
    '/:id/select-offer',
    isAuthorized(SELECT_POST_OFFER),
    restrictToOwner(Post, 'user', "You don't have the permission to select offer for this post"),
    validateUpdateSelectedOffer,
    updateSelectedOffer
);

export default router;
