import {
    CREATE_OFFER,
    DELETE_OFFER,
    GET_ALL_OFFERS,
    GET_OFFER,
    UPDATE_OFFER,
} from '#src/modules/offer/endpoints.js';
import {
    createOffer,
    deleteOffer,
    getAllOffers,
    getOffer,
    updateOffer,
} from '#src/modules/offer/offer.controller.js';
import { validateCreateOffer, validateUpdateOffer } from '#src/modules/offer/offer.validator.js';
import { isAuthorized } from '#src/shared/middlewares/authorization.middleware.js';
import express from 'express';

const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(isAuthorized(GET_ALL_OFFERS), getAllOffers)
    .post(isAuthorized(CREATE_OFFER), validateCreateOffer, createOffer);
router
    .route('/:id')
    .get(isAuthorized(GET_OFFER), getOffer)
    .patch(isAuthorized(UPDATE_OFFER), validateUpdateOffer, updateOffer)
    .delete(isAuthorized(DELETE_OFFER), deleteOffer);

export default router;
