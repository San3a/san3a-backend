import * as factory from '#src/shared/services/handler-factory.js';
import { asyncHandler } from '#src/shared/utils/async-handler.js';
import { StatusCodes } from 'http-status-codes';
import Offer from './offer.model.js';
import { SUCCESS } from '#src/shared/utils/response-status.js';

export const createOffer = factory.createOne(Offer);
export const getAllOffers = factory.getAll(Offer, null, { postId: 'post' });
export const getOffer = factory.getOne(Offer);
export const updateOffer = factory.updateOne(Offer);
export const deleteOffer = factory.deleteOne(Offer);
export const didTechnicianMakeOffer = asyncHandler(async (req, res, next) => {
    const existingOffer = await Offer.exists({
        post: req.params.postId,
        technician: req.user._id,
    });
    const didMakeOffer = existingOffer !== null;

    res.status(StatusCodes.OK).json({
        status: SUCCESS,
        data: {
            didMakeOffer,
        },
    });
});

export const getSingleOffer = asyncHandler(async(req, res, next) => {
    const {id} = req.params;
    const offer = await Offer.findById(id);
    
    res.status(StatusCodes.OK).json({
        status: SUCCESS,
        data: {
            offer,
        },
    })
})