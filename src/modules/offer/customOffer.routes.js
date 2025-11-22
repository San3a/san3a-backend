import { getSingleOffer } from '#src/modules/offer/offer.controller.js';
import express from 'express';
const router = express.Router();

router.route('/:id')
    .get(getSingleOffer);

export default router;