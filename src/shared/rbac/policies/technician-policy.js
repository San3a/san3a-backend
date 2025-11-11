import {
    CREATE_OFFER,
    DELETE_OFFER,
    GET_ALL_OFFERS,
    GET_OFFER,
    UPDATE_OFFER,
} from '#src/modules/offer/endpoints.js';

// we add here endpoints that are valid for technician role
export default [CREATE_OFFER, GET_ALL_OFFERS, GET_OFFER, UPDATE_OFFER, DELETE_OFFER];
