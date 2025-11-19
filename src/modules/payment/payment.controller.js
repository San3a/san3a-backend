import Stripe from 'stripe';
import { StatusCodes } from 'http-status-codes';
import { CLIENT_URL } from '#src/config/config.js';

import { asyncHandler } from '#src/shared/utils/async-handler.js';
import AppError from '#src/shared/utils/app-error.js';

import Offer from '#src/modules/offer/offer.model.js';
import * as AppointmentService from '#src/modules/appointment/appointment.service.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//  1) Checkout for Offer
// POST /api/payments/checkout/offer/:offerId
export const createCheckoutSessionForOffer = asyncHandler(async (req, res, next) => {
    const { offerId } = req.params;

    const offer = await Offer.findById(offerId).populate('post');
    if (!offer) {
        throw new AppError('Offer not found', StatusCodes.NOT_FOUND);
    }

    if (offer.post.user.toString() !== req.user.id) {
        throw new AppError('You are not allowed to pay for this offer', StatusCodes.FORBIDDEN);
    }

    // 3) Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        success_url: `${CLIENT_URL}/payments/success?type=offer&offerId=${offer.id}`,
        cancel_url: `${CLIENT_URL}/posts/${offer.post.id}`,
        customer_email: req.user.email,
        metadata: {
            type: 'offer',
            offerId: offer.id,
            postId: offer.post.id,
            technicianId: offer.technician._id.toString(),
            userId: req.user.id,
        },
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    unit_amount: Math.round(offer.price * 100),
                    product_data: {
                        name: `Offer for: ${offer.post.title}`,
                        description: offer.post.description || 'San3a job',
                    },
                },
                quantity: 1,
            },
        ],
    });

    res.status(StatusCodes.OK).json({
        status: 'success',
        session,
    });
});

//  2) Checkout for Appointment
// POST /api/payments/checkout/appointment/:technicianId
export const createCheckoutSessionForAppointment = asyncHandler(async (req, res, next) => {
    const { technicianId } = req.params;
    const { startTime, problemDescription, price, platformDiscountAmount } = req.body;

    if (!startTime || price == null) {
        throw new AppError('startTime and price are required', StatusCodes.BAD_REQUEST);
    }

    // 1) Create pending appointment
    const appointment = await AppointmentService.createAppointment({
        customer: req.user.id,
        technician: technicianId,
        startTime,
        problemDescription,
        price,
        platformDiscountAmount: platformDiscountAmount || 0,
        platformDiscountSource: platformDiscountAmount ? 'san3a-promo' : 'none',
        status: 'pending',
    });

    const chargePrice = appointment.getChargePrice();

    // 2) Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        success_url: `${CLIENT_URL}/payments/success?type=appointment&appointmentId=${appointment.id}`,
        cancel_url: `${CLIENT_URL}/technicians/${technicianId}`,
        customer_email: req.user.email,
        metadata: {
            type: 'appointment',
            appointmentId: appointment.id,
            technicianId,
            userId: req.user.id,
        },
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    unit_amount: Math.round(chargePrice * 100),
                    product_data: {
                        name: 'Appointment with technician',
                        description: problemDescription || 'San3a appointment',
                    },
                },
                quantity: 1,
            },
        ],
    });

    res.status(StatusCodes.OK).json({
        status: 'success',
        session,
    });
});

// 3) Webhook Handler

const handleCheckoutSessionCompleted = async (session) => {
    const meta = session.metadata || {};
    const type = meta.type;

    if (type === 'offer') {
        await Offer.findByIdAndUpdate(meta.offerId, { status: 'paid' }, { new: true });
        return;
    }

    if (type === 'appointment') {
        await AppointmentService.markAppointmentPaid(meta.appointmentId);
        return;
    }
};

export const stripeWebhook = (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Stripe webhook signature error:', err.message);
        return res.status(StatusCodes.BAD_REQUEST).send(`Webhook error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        handleCheckoutSessionCompleted(session).catch((err) =>
            console.error('Error handling checkout.session.completed:', err)
        );
    }

    res.status(StatusCodes.OK).json({ received: true });
};
