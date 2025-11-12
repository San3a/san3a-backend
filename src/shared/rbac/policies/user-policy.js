import {
    GET_ALL_POSTS,
    GET_POST,
    CREATE_POST,
    UPDATE_POST,
    DELETE_POST,
    UPDATE_POST_STATUS,
    SELECT_POST_OFFER,
    GET_USER_POSTS,
} from '#src/modules/post/endpoints.js';

// we add here endpoints that are valid for user role
export default [
    GET_ALL_POSTS,
    GET_POST,
    CREATE_POST,
    UPDATE_POST,
    DELETE_POST,
    UPDATE_POST_STATUS,
    SELECT_POST_OFFER,
    GET_USER_POSTS,
];
