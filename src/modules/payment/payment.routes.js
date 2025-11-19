import express from 'express';
import { isAuthorized } from '#src/shared/middlewares/authorization.middleware.js';
import { CREATE_OFFER } from '#src/modules/offer/endpoints.js';
import { CREATE_APPOINTMENT } from '#src/modules/appointment/endpoints.js';

import {
    createCheckoutSessionForOffer,
    createCheckoutSessionForAppointment,
    stripeWebhook,
} from './payment.controller.js';

const router = express.Router({ mergeParams: true });

export { stripeWebhook };

//  Offer
// POST /api/payments/checkout/offer/:offerId
router.post('/checkout/offer/:offerId', isAuthorized(CREATE_OFFER), createCheckoutSessionForOffer);

//  Appointment
// POST /api/payments/checkout/appointment/:technicianId
router.post(
    '/checkout/appointment/:technicianId',
    isAuthorized(CREATE_APPOINTMENT),
    createCheckoutSessionForAppointment
);

export default router;
