import Joi from 'joi';
import TechnicianRoles from '#src/shared/enums/technician-roles.js';
import { validate } from '#src/shared/middlewares/validation.middleware.js';
import objectId from '#src/shared/utils/joi-validators/validate-objectid.js';

const createPostSchema = Joi.object({
    user: Joi.string().hex().length(24).required().label('User ID'),
    images: Joi.array()
        .items(
            Joi.object({
                public_id: Joi.string().required(),
                url: Joi.string().uri().required(),
            })
        )
        .required()
        .label('Images'),
    title: Joi.string().min(5).max(100).required().label('Title'),
    description: Joi.string().min(5).required().label('Description'),
    tags: Joi.array().items(Joi.string().lowercase().trim()).max(10).label('Tags'),

    category: objectId('Category').required().label('Category'),

    location: Joi.object({
        type: Joi.string().valid('Point').required(),
        coordinates: Joi.array().items(Joi.number()).length(2).required(),
        address: Joi.string().allow('').optional(),
    })
        .required()
        .label('Location'),

    status: Joi.string().valid('open', 'in-progress', 'completed').default('open').label('Status'),

    offersCount: Joi.number().integer().min(0).default(0).label('Offers Count'),

    selectedOffer: Joi.string().optional().allow(null).label('Selected Offer'),
}).unknown(false);

const updatePostSchema = Joi.object({
    title: Joi.string().min(5).max(100),
    description: Joi.string().min(5),
    images: Joi.array()
        .items(
            Joi.object({
                public_id: Joi.string().required(),
                url: Joi.string().uri().required(),
                _id: Joi.alternatives().try(Joi.string(), Joi.object()).optional(),
            }).unknown(true)
        )
        .optional(),
    existingImages: Joi.array().items(Joi.string()).optional(),
    tags: Joi.array().items(Joi.string().lowercase().trim()).max(10),
    category: objectId('Category').label('Category'),
    location: Joi.object({
        type: Joi.string().valid('Point'),
        coordinates: Joi.array().items(Joi.number()).length(2),
        address: Joi.string().allow(''),
    }),
})
    .min(1)
    .custom((value, helpers) => {
        const hasNewImages = value.images && value.images.length > 0;
        const hasExistingImages = value.existingImages && value.existingImages.length > 0;

        if (!hasNewImages && !hasExistingImages) {
            return helpers.error('any.custom', {
                message: 'At least one image is required (either new images or existing images)',
            });
        }

        return value;
    })
    .unknown(false);

const updatePostStatusSchema = Joi.object({
    status: Joi.string().valid('open', 'in-progress', 'completed').required(),
}).unknown(false);

const updateSelectedOfferSchema = Joi.object({
    selectedOffer: Joi.string().required(),
}).unknown(false);

export const validateCreatePost = validate(createPostSchema);
export const validateUpdatePost = validate(updatePostSchema);
export const validateUpdatePostStatus = validate(updatePostStatusSchema);
export const validateUpdateSelectedOffer = validate(updateSelectedOfferSchema);
