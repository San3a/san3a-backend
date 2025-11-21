import {
    CREATE_CATEGORY,
    DELETE_CATEGORY,
    UPDATE_CATEGORY,
} from '#src/modules/category/endpoints.js';

import { DELETE_OFFER, GET_ALL_OFFERS, GET_OFFER } from '#src/modules/offer/endpoints.js';
import { GET_ALL_POSTS, GET_POST, DELETE_POST } from '#src/modules/post/endpoints.js';
import { GET_TOP_TECHNICIANS_NEARBY } from '#src/modules/user/endpoints.js';

// we add here endpoints that are valid for admin role

export default [
    CREATE_CATEGORY,
    UPDATE_CATEGORY,
    DELETE_CATEGORY,
    GET_ALL_POSTS,
    GET_POST,
    DELETE_POST,
    GET_ALL_OFFERS,
    GET_OFFER,
    DELETE_OFFER,
    GET_TOP_TECHNICIANS_NEARBY,
];
