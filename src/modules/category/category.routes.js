import {
    createCategoryHandler,
    deleteCategoryHandler,
    getAllCategorysHandler,
    getCategoryHandler,
    updateCategoryHandler,
} from '#src/modules/category/category.controller.js';
import {
    CREATE_CATEGORY,
    UPDATE_CATEGORY,
    DELETE_CATEGORY,
} from '#src/modules/category/endpoints.js';
import Category from '#src/modules/category/category.model.js';
import { isAuthorized } from '#src/shared/middlewares/authorization.middleware.js';
import restrictToOwner from '#src/shared/middlewares/check-owner.middleware.js';
import { handleImageCreate } from '#src/shared/middlewares/handleImageCreate.js';
import { handleImageUpdate } from '#src/shared/middlewares/handleImageUpdate.js';
import express from 'express';
import { upload } from '#src/shared/utils/upload.js';
import { validate } from '#src/shared/middlewares/validation.middleware.js';
import { createCategorySchema } from '#src/modules/category/category.validator.js';

const router = express.Router();

router
    .route('/')
    .get(getAllCategorysHandler)
    .post(
        isAuthorized(CREATE_CATEGORY),
        upload.array('image', 1),
        handleImageCreate(Category),
        validate(createCategorySchema),
        createCategoryHandler
    );

router
    .route('/:id')
    .get(getCategoryHandler)
    .patch(
        isAuthorized(UPDATE_CATEGORY),
        upload.array('image', 1),
        handleImageUpdate(Category),
        restrictToOwner(Category),
        updateCategoryHandler
    )
    .delete(isAuthorized(DELETE_CATEGORY), restrictToOwner(Category), deleteCategoryHandler);

export default router;
