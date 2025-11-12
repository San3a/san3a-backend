import { asyncHandler } from '#src/shared/utils/async-handler.js';
import { StatusCodes } from 'http-status-codes';
import AppError from '#src/shared/utils/app-error.js';
import Post from '../post/post.model.js';

export const setOfferBody = (req, res, next) => {
    req.body.post = req.params.id;
    req.body.technician = req.user._id;
    next();
};

export const isPostAvailable = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.exists({ _id: id });
    if (!post) {
        return next(new AppError('No post found with this ID', StatusCodes.NOT_FOUND));
    }
    next();
});
