import * as factory from '#src/shared/services/handler-factory.js';
import Offer from './offer.model.js';

export const createOffer = factory.createOne(Offer);
export const getAllOffers = factory.getAll(Offer, null, { id: 'post' });
export const getOffer = factory.getOne(Offer);
export const updateOffer = factory.updateOne(Offer);
export const deleteOffer = factory.deleteOne(Offer);
