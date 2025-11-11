import * as factory from '#src/shared/services/handler-factory.js';
import { asyncHandler } from '#src/shared/utils/async-handler.js';

import Post from './post.model.js';

export const getAllPosts = factory.getAll(Post);
export const getUserPosts = asyncHandler(async (req, res, next) => {
    req.params.id = req.user.id;
    return factory.getAll(Post, null, { id: 'user' });
});
export const getPost = factory.getOne(Post);
export const createPost = factory.createOne(Post);
export const deletePost = factory.deleteOne(Post);
export const updatePostStatus = factory.updateOne(Post);
export const updateSelectedOffer = factory.updateOne(Post);
