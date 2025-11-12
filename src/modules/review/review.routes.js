import { CREATE_REVIEW } from '#src/modules/review/endpoints.js';
import { createReview, deleteReview, getAllReviews, getReview, updateReview } from '#src/modules/review/review.controller.js';
import { isAuthorized } from '#src/shared/middlewares/authorization.middleware.js';
import express from 'express';

const router = express.Router();

router.route('/')
    .get(getAllReviews)
    .post(isAuthorized(CREATE_REVIEW), createReview);

router.route('/:id')
    .get(getReview)
    .patch(updateReview)
    .delete(deleteReview);

export default router;