import express from 'express';
import { isAuthorized } from '#src/shared/middlewares/authorization.middleware.js';
import { CREATE_OFFER } from '#src/modules/offer/endpoints.js';
import { CREATE_APPOINTMENT, PAY_FOR_TECH_SERVICE } from '#src/modules/appointment/endpoints.js';

import {
    createCheckoutSessionForOffer,
    createCheckoutSessionForAppointment,
    stripeWebhook,
    createCheckoutSessionForTechService,
    retriveStripeSession,
} from './payment.controller.js';
import { CANCEL_PAYMENT } from '#src/modules/ServiceOrder/endpoints.js';

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


//  TechService
// POST /api/payments/checkout/techService/:techServiceId
router.post(
    '/checkout/techService/:techServiceId',
    isAuthorized(PAY_FOR_TECH_SERVICE),
    createCheckoutSessionForTechService
);

router.get(
    '/session/:id', 
    isAuthorized(CANCEL_PAYMENT), 
    retriveStripeSession
);

export default router;
