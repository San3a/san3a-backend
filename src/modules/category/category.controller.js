import Category from '#src/modules/category/category.model.js';
import * as factory from '#src/shared/services/handler-factory.js';

export const getAllCategorysHandler = factory.getAll(Category);
export const getCategoryHandler = factory.getOne(Category);
export const updateCategoryHandler = factory.updateOne(Category);
export const deleteCategoryHandler = factory.deleteOne(Category);
export const createCategoryHandler = factory.createOne(Category);
