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
import {
    DELETE_USER,
    UPDATE_USER,
    GETPASTWORK,
    GETMYREVIEWS,
    GET_TOP_TECHNICIANS_NEARBY,
} from '#src/modules/user/endpoints.js';

import {
    GET_ALL_TECHSERVICES,
    GET_SPECIFIC_TECHSERVICE,
} from '#src/modules/tech-service/endpoints.js';

import { CREATE_REVIEW, DELETE_REVIEW, UPDATE_REVIEW } from '#src/modules/review/endpoints.js';
import { CREATE_OFFER, GET_ALL_OFFERS, GET_OFFER } from '#src/modules/offer/endpoints.js';
import { CREATE_APPOINTMENT, PAY_FOR_TECH_SERVICE } from '#src/modules/appointment/endpoints.js';
import { CANCEL_PAYMENT, CREATE_SERVICE_ORDER } from '#src/modules/ServiceOrder/endpoints.js';
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

    GET_ALL_TECHSERVICES,
    GET_SPECIFIC_TECHSERVICE,

    UPDATE_USER,
    DELETE_USER,

    CREATE_REVIEW,
    UPDATE_REVIEW,
    DELETE_REVIEW,
    GETMYREVIEWS,

    GET_ALL_OFFERS,
    GET_OFFER,

    GETPASTWORK,

    CREATE_OFFER,
    CREATE_APPOINTMENT,
    PAY_FOR_TECH_SERVICE,
    CREATE_SERVICE_ORDER,
    CANCEL_PAYMENT,

    
    GET_TOP_TECHNICIANS_NEARBY,
];
