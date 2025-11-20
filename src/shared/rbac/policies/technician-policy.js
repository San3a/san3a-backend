import { GET_ALL_POSTS, GET_POST, GET_USER_POSTS } from '#src/modules/post/endpoints.js';
import {
    CREATE_OFFER,
    DELETE_OFFER,
    GET_ALL_OFFERS,
    GET_DID_TECHNICIAN_ADD_OFFER_TO_POST,
    GET_OFFER,
    UPDATE_OFFER,
} from '#src/modules/offer/endpoints.js';

import {
    CREATE_TECHSERVICE,
    UPDATE_TECHSERVICE,
    DELETE_TECHSERVICE,
    GET_ALL_TECHSERVICES,
    GET_SPECIFIC_TECHSERVICE,
    ADD_TECHSERVICE_AVAILABILTY,
} from '#src/modules/tech-service/endpoints.js';

import { CREATE_PASTWORK } from '#src/modules/past-work/endpoints.js';
import { DELETE_USER, UPDATE_USER, GETPASTWORK } from '#src/modules/user/endpoints.js';

export default [
    CREATE_OFFER,
    GET_ALL_OFFERS,
    GET_OFFER,
    GET_DID_TECHNICIAN_ADD_OFFER_TO_POST,
    UPDATE_OFFER,
    DELETE_OFFER,
    CREATE_TECHSERVICE,
    UPDATE_TECHSERVICE,
    DELETE_TECHSERVICE,
    GET_ALL_TECHSERVICES,
    GET_SPECIFIC_TECHSERVICE,
    ADD_TECHSERVICE_AVAILABILTY,
    GET_ALL_POSTS,
    GET_USER_POSTS,
    GET_POST,

    UPDATE_USER,
    DELETE_USER,

    CREATE_PASTWORK,
];
