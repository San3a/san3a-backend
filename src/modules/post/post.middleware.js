import Post from './post.model.js';
import AppError from '#src/shared/utils/app-error.js';
import { StatusCodes } from 'http-status-codes';
import cloudinaryV2 from '#src/config/cloudinary.js';

export const setPostBody = (req, res, next) => {
    req.body = { ...req.body, user: req.user.id };
    next();
};

export const setUserIdToParams = (req, res, next) => {
    req.params = { ...req.params, userId: req.user._id };
    next();
};

export const handleExistingPostImages = async (req, res, next) => {
    if (!req.body.existingImages) {
        return next();
    }
    const post = await Post.findById(req.params.id);
    if (!post) {
        return next(new AppError('Post not found', StatusCodes.NOT_FOUND));
    }

    if (req.body.existingImages.length === post.images.length) {
        return next();
    }

    const imagesToDelete = post.images.filter(
        (img) => !req.body.existingImages.includes(img.public_id)
    );

    if (imagesToDelete.length > 0) {
        await Promise.all(
            imagesToDelete.map((img) => cloudinaryV2.uploader.destroy(img.public_id))
        );
    }

    post.images = post.images.filter((img) => req.body.existingImages.includes(img.public_id));

    await post.save();
    next();
};
