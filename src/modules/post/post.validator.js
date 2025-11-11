import { FAIL } from '#src/shared/utils/response-status';
import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';

const postValidationSchema = Joi.object({
    user: Joi.string().required().label('User ID'),

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
        .valid('Plumbing', 'Electrical', 'AC Repair', 'Painting', 'Carpentry')
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
});

export const validatePost = (req, res, next) => {
    const { error } = postValidationSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errors = error.details.map((d) => d.message);
        return res.status(StatusCodes.BAD_REQUEST).json({ status: FAIL, errors });
    }
    next();
};
