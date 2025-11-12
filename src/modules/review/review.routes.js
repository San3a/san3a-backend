import { CREATE_REVIEW, DELETE_REVIEW, UPDATE_REVIEW } from '#src/modules/review/endpoints.js';
import { createReview, deleteReview, getAllReviews, getReview, updateReview } from '#src/modules/review/review.controller.js';
import Review from '#src/modules/review/review.model.js';
import { isAuthorized } from '#src/shared/middlewares/authorization.middleware.js';
import restrictToOwner from '#src/shared/middlewares/check-owner.middleware.js';
import { handleImageCreate } from '#src/shared/middlewares/handleImageCreate.js';
import { upload } from '#src/shared/utils/upload.js';
import express from 'express';

const router = express.Router();

router.route('/')
    .get(getAllReviews)
    .post(
        isAuthorized(CREATE_REVIEW), 
        createReview
    );

router.route('/:id')
    .get(getReview)
    .patch(
        isAuthorized(UPDATE_REVIEW), 
        restrictToOwner(Review),
        updateReview
    )
    .delete(
        isAuthorized(DELETE_REVIEW), 
        restrictToOwner(Review),
        deleteReview
    );

export default router;