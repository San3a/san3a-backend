import { DELETE_OFFER, GET_ALL_OFFERS, GET_OFFER } from '#src/modules/offer/endpoints.js';
import { GET_ALL_POSTS, GET_POST, DELETE_POST } from '#src/modules/post/endpoints.js';

// we add here endpoints that are valid for admin role
export default [GET_ALL_POSTS, GET_POST, DELETE_POST, GET_ALL_OFFERS, GET_OFFER, DELETE_OFFER];
