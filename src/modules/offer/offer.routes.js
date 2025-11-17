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
import restrictToOwner from '#src/shared/middlewares/check-owner.middleware.js';
import express from 'express';
import {
    isOfferOnPost,
    isPostAvailable,
    setOfferBody,
} from '#src/modules/offer/offer.middleware.js';
import Offer from './offer.model.js';

const router = express.Router({ mergeParams: true });

router.use(isPostAvailable);

router
    .route('/')
    .get(isAuthorized(GET_ALL_OFFERS), getAllOffers)
    .post(isAuthorized(CREATE_OFFER), validateCreateOffer, setOfferBody, createOffer);
router
    .route('/:id')
    .get(isAuthorized(GET_OFFER), isOfferOnPost, getOffer)
    .patch(
        isAuthorized(UPDATE_OFFER),
        restrictToOwner(Offer, 'technician', 'You are not allowed to update this offer'),
        isOfferOnPost,
        validateUpdateOffer,
        updateOffer
    )
    .delete(isAuthorized(DELETE_OFFER), isOfferOnPost, deleteOffer);

export default router;
