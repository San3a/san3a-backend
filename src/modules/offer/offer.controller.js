import * as factory from '#src/shared/services/handler-factory.js';
import Offer from './offer.model.js';

export const createOffer = (req, res, next) => {
    req.body.technician = req.user.id;
    req.body.post = req.params.id;
    return factory.createOne(Offer)(req, res, next);
};
export const getAllOffers = factory.getAll(Offer);
export const getOffer = factory.getOne(Offer);
export const updateOffer = factory.updateOne(Offer);
export const deleteOffer = factory.deleteOne(Offer);
