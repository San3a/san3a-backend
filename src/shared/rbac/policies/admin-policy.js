import {
    CREATE_CATEGORY,
    DELETE_CATEGORY,
    UPDATE_CATEGORY,
} from '#src/modules/category/endpoints.js';

// we add here endpoints that are valid for admin role

export default [CREATE_CATEGORY, UPDATE_CATEGORY, DELETE_CATEGORY];
