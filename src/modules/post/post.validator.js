import Joi from 'joi';
import TechnicianRoles from '#src/shared/enums/technician-roles.js';
import { validate } from '#src/shared/middlewares/validation.middleware.js';

const createPostSchema = Joi.object({
    user: Joi.string().hex().length(24).required().label('User ID'),

    title: Joi.string().min(5).max(100).required().label('Title'),

    description: Joi.string().min(5).required().label('Description'),

    images: Joi.array()
        .items(
            Joi.object({
                public_id: Joi.string().required(),
                url: Joi.string().uri().required(),
            })
        )
        .label('Images'),

    tags: Joi.array().items(Joi.string().lowercase().trim()).max(10).label('Tags'),

    category: Joi.string()
        .valid(...Object.values(TechnicianRoles))
        .required()
        .label('Category'),

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
    images: Joi.array().items(
        Joi.object({
            public_id: Joi.string().required(),
            url: Joi.string().uri().required(),
        })
    ),
    tags: Joi.array().items(Joi.string().lowercase().trim()).max(10),
    category: Joi.string().valid(...Object.values(TechnicianRoles)),
    location: Joi.object({
        type: Joi.string().valid('Point'),
        coordinates: Joi.array().items(Joi.number()).length(2),
        address: Joi.string().allow(''),
    }),
})
    .min(1)
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
