import {
    createOffer,
    deleteOffer,
    getAllOffers,
    getOffer,
    updateOffer,
} from '#src/modules/offer/offer.controller.js';
import express from 'express';

const router = express.Router({ mergeParams: true });

router.route('/').get(getAllOffers).post(createOffer);
router.route('/:id').get(getOffer).patch(updateOffer).delete(deleteOffer);

export default router;
