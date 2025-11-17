import { asyncHandler } from '#src/shared/utils/async-handler.js';
import { StatusCodes } from 'http-status-codes';
import AppError from '#src/shared/utils/app-error.js';
import Post from '../post/post.model.js';
import Offer from './offer.model.js';

export const setOfferBody = (req, res, next) => {
    req.body.post = req.params.postId;
    req.body.technician = req.user._id;
    next();
};

export const isPostAvailable = asyncHandler(async (req, res, next) => {
    const { postId } = req.params;
    const post = await Post.exists({ _id: postId });
    if (!post) {
        return next(new AppError('No post found with this ID', StatusCodes.NOT_FOUND));
    }
    next();
});

export const isOfferOnPost = asyncHandler(async (req, res, next) => {
    const { postId } = req.params;
    console.log(req.params);
    const doesOfferExist = await Offer.exists({ _id: req.params.id, post: postId });
    if (!doesOfferExist) {
        return next(
            new AppError('No offer found with this ID on the specified post', StatusCodes.NOT_FOUND)
        );
    }
    next();
});
