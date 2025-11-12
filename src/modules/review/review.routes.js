import { createReview, deleteReview, getAllReviews, getReview, updateReview } from '#src/modules/review/review.controller.js';
import express from 'express';

const router = express.Router();

router.route('/')
    .get(getAllReviews)
    .post(createReview);

router.route('/:id')
    .get(getReview)
    .patch(updateReview)
    .delete(deleteReview);

export default router;