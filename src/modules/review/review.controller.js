import Review from '#src/modules/review/review.model.js';
import { createOne, deleteOne, getAll, getOne, updateOne } from '#src/shared/services/handler-factory.js';
import AppError from '#src/shared/utils/app-error.js';
import { asyncHandler } from '#src/shared/utils/async-handler.js';

export const getAllReviews = getAll(Review);

export const getReview = getOne(Review);

// NOTE: Each user can only review once in a post 
export const createReview = asyncHandler(async (req, res, next) => {
    const { techService, user } = req.body; 
    const isUserReviewdBefore = await Review.exists({
        techService,
        user
    });

    if(isUserReviewdBefore) {
        const appError = new AppError('You have already reviwed before at this post!', 400);
        return next(appError);
    }

    return createOne(Review)(req, res, next); 
})  

export const updateReview = updateOne(Review);

export const deleteReview = deleteOne(Review);
