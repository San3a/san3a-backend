import Review from '#src/modules/review/review.model.js';
import { createOne, deleteOne, getAll, getOne, updateOne } from '#src/shared/services/handler-factory.js';

export const getAllReviews = getAll(Review);

export const getReview = getOne(Review);

export const createReview = createOne(Review);

export const updateReview = updateOne(Review);

export const deleteReview = deleteOne(Review);
