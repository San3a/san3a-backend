import {
    createOffer,
    deleteOffer,
    getAllOffers,
    getOffer,
    updateOffer,
} from '#src/modules/offer/offer.controller.js';
import { validateCreateOffer, validateUpdateOffer } from '#src/modules/offer/offer.validator.js';
import express from 'express';

const router = express.Router({ mergeParams: true });

router.route('/').get(getAllOffers).post(validateCreateOffer, createOffer);
router.route('/:id').get(getOffer).patch(validateUpdateOffer, updateOffer).delete(deleteOffer);

export default router;
