import Joi from 'joi';

export const createCategorySchema = Joi.object({
    name: Joi.string().min(1).required().messages({
        'string.empty': 'Category name is required',
        'any.required': 'Category name is required',
    }),

    nameAr: Joi.string().min(1).required().messages({
        'string.empty': 'Arabic category name is required',
        'any.required': 'Arabic category name is required',
    }),

    description: Joi.string().allow('', null).max(500).messages({
        'string.max': 'Description is too long, maximum 500 characters',
    }),

    descriptionAr: Joi.string().allow('', null).max(500).messages({
        'string.max': 'Arabic description is too long, maximum 500 characters',
    }),

    images: Joi.array()
        .items(
            Joi.object({
                url: Joi.string().uri().required().messages({
                    'string.empty': 'Image URL is required',
                    'string.uri': 'Image URL must be a valid URI',
                }),
                public_id: Joi.string().allow('', null),
            })
        )
        .min(1)
        .required()
        .messages({
            'array.min': 'At least one image is required',
            'any.required': 'Images are required',
        }),
});
