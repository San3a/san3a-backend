import * as factory from '#src/shared/services/handler-factory.js';
import { asyncHandler } from '#src/shared/utils/async-handler.js';
import { StatusCodes } from 'http-status-codes';
import { FAIL } from '#src/shared/utils/response-status.js';
import Offer from './offer.model.js';

export const createOffer = (req, res, next) => {
    req.body.technician = '672ea0b2f9e1234f89a0df67';
    req.body.post = req.params.id;
    return factory.createOne(Offer)(req, res, next);
};
export const getAllOffers = factory.getAll(Offer, null, { id: 'post' });
export const getOffer = factory.getOne(Offer);
export const updateOffer = asyncHandler(async (req, res, next) => {
    const offer = await Offer.findById(req.params.id);
    if (offer.technician.toString() !== req.user.id) {
        return res
            .status(StatusCodes.FORBIDDEN)
            .json({ status: FAIL, message: 'You are not allowed to update this offer' });
    }
    return factory.updateOne(Offer)(req, res, next);
});

export const deleteOffer = factory.deleteOne(Offer);
