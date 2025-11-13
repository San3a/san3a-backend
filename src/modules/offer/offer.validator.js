import { validate } from '#src/shared/middlewares/validation.middleware.js';
import joi from 'joi';

const createOfferSchema = joi.object({
    price: joi.number().min(0).required().label('Price'),
    message: joi.string().required().label('Message'),
});

const updateOfferSchema = joi
    .object({
        price: joi.number().min(0).label('Price'),
        message: joi.string().label('Message'),
    })
    .min(1);

export const validateCreateOffer = validate(createOfferSchema);
export const validateUpdateOffer = validate(updateOfferSchema);
