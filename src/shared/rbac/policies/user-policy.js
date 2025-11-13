// we add here endpoints that are valid for user role
import { DELETE_USER, UPDATE_USER } from '#src/modules/user/endpoints.js';

import {GET_ALL_TECHSERVICES, GET_SPECIFIC_TECHSERVICE } from '#src/modules/tech-service/endpoints.js';

import { CREATE_REVIEW, DELETE_REVIEW, UPDATE_REVIEW } from '#src/modules/review/endpoints.js';

export default [
    GET_ALL_TECHSERVICES, 
    GET_SPECIFIC_TECHSERVICE,
    
    UPDATE_USER,
    DELETE_USER,

    CREATE_REVIEW,
    UPDATE_REVIEW,
    DELETE_REVIEW,
];
