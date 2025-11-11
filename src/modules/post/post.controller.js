import * as factory from '#src/shared/services/handler-factory.js';

import Post from './post.model.js';

export const getAllPosts = factory.getAll(Post);
export const getPost = factory.getOne(Post);
export const createPost = factory.createOne(Post);
export const updatePost = factory.updateOne(Post);
export const deletePost = factory.deleteOne(Post);
export const updatePostStatus = factory.updateOne(Post);
export const selectPostOffer = factory.updateOne(Post);
