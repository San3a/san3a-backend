import Joi from 'joi';

export const createTechServiceSchema = Joi.object({
    title: Joi.string().min(3).max(30).required().messages({
        'string.empty': 'Service name is required!',
        'string.min': 'Service name is too short, it must be >= 3 characters',
        'string.max': "Service name is too long, it mustn't exceed 30 characters",
    }),

    description: Joi.string().min(5).max(300).required().trim().messages({
        'string.empty': 'Service description is required!',
        'string.min': 'Service description is too short, it must be >= 5 characters',
        'string.max': "Service description is too long, it mustn't exceed 300 characters",
    }),

    price: Joi.number().min(0).required().messages({
        'number.base': 'Service price must be a number',
        'number.min': 'Service price must be a positive number',
        'any.required': 'Service price is required!',
    }),

    images: Joi.array()
        .items(
            Joi.object({
                public_id: Joi.string().required().messages({
                    'string.empty': 'Image public_id is required',
                }),
                url: Joi.string().uri().required().messages({
                    'string.empty': 'Image URL is required',
                    'string.uri': 'Image URL must be a valid URI',
                }),
            })
        )
        .min(1)
        .required()
        .messages({
            'array.min': 'At least one image is required',
            'any.required': 'Images are required',
        }),

    ratingsAverage: Joi.number().min(1).max(5).messages({
        'number.min': "Rating can't be less than 1.0",
        'number.max': "Rating can't be more than 5.0",
    }),

    category: Joi.string().required().messages({
        'any.required': 'Product category is required!',
        'string.empty': 'Product category is required!',
    }),

    ratingsQuantity: Joi.number().min(0).messages({
        'number.min': 'Ratings quantity must be a positive number',
    }),
});

export const updateTechServiceSchema = Joi.object({});

export const addAvailabilitySchema = Joi.object({
    availabity: Joi.array()
        .items(
            Joi.object({
                day: Joi.date().required().messages({
                    'any.required': 'Day is required',
                    'date.base': 'Day must be a valid date',
                }),

                slots: Joi.array()
                    .items(
                        Joi.object({
                            start: Joi.string()
                                .pattern(/^\d{2}:\d{2}$/)
                                .required()
                                .messages({
                                    'string.pattern.base': 'Start time must be in HH:MM format',
                                    'any.required': 'Start time is required',
                                }),

                            end: Joi.string()
                                .pattern(/^\d{2}:\d{2}$/)
                                .required()
                                .messages({
                                    'string.pattern.base': 'End time must be in HH:MM format',
                                    'any.required': 'End time is required',
                                }),
                        })
                    )
                    .required()
                    .messages({
                        'any.required': 'Slots are required',
                        'array.base': 'Slots must be an array',
                    }),
            })
        )
        .min(1)
        .required()
        .messages({
            'array.min': 'You must provide at least one availability entry',
            'any.required': 'availabity field is required',
        }),
});
