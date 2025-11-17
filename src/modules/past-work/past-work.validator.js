import Joi from 'joi';

export const createPastWorkSchema = Joi.object({
    title: Joi.string().min(5).max(50).required().messages({
        'any.required': 'Title is required',
        'string.empty': 'Title is required',
        'string.min': 'Title is too short, it must be >= 5 characters',
        'string.max': "Title is too long, it mustn't exceed 50 characters",
    }),

    description: Joi.string().min(8).max(500).required().messages({
        'any.required': 'description is required',
        'string.empty': 'description is required',
        'string.min': 'description is too short, it must be >= 8 characters',
        'string.max': "description is too long, it mustn't exceed 500 characters",
    }),

    images: Joi.array().items(
        Joi.object({
            public_id: Joi.string().required().messages({
                'string.empty': 'Image public_id is required',
            }),
            url: Joi.string().required().messages({
                'string.empty': 'Image url is required',
                'string.uri': 'Image url is invalid'
            }),
        }),
    )
    .min(1).max(10).required().messages({
        'array.min': 'You must upload at least one image',
        'any.required': 'Images are required',
    }),

    userId: Joi.string().hex().length(24).required().messages({
        'any.required': 'userId id is required',
        'string.empty': 'userId id is required',
        'string.hex': 'userId id must be a valid MongoDB ID',
        'string.length': 'userId id must be a valid MongoDB ID',
    }),

    location: Joi.object({
        type: Joi.string().valid('Point').required().messages({
            'any.required': 'location is required',
            'any.only': 'Location type must be "Point"',
        }),

        coordinates: Joi.array().items(Joi.number()).length(2).required().messages({ // Corrected typo here
            'any.required': 'Coordinates are required',
            'array.length': 'Coordinates must contain exactly 2 numbers (longitude, latitude)',
        }),
    }).optional(),

    dateCompleted: Joi.date().optional(),
    customerName: Joi.string().optional(),
});

export const updatePastWorkSchema = Joi.object({
    title: Joi.string()
        .min(5)
        .max(50)
        .optional()
        .messages({
            'string.min': 'Title is too short, it must be >= 5 characters',
            'string.max': "Title is too long, it mustn't exceed 50 characters",
        }),

    description: Joi.string()
        .min(8)
        .max(500)
        .optional()
        .messages({
            'string.min': 'description is too short, it must be >= 8 characters',
            'string.max': "description is too long, it mustn't exceed 500 characters",
        }),

    //BUG: Gives bug when uploading image 
    images: Joi.array().items(
        Joi.object({
            public_id: Joi.string().required().messages({
                'string.empty': 'Image public_id is required',
            }),
            url: Joi.string().required().messages({
                'string.empty': 'Image url is required',
                'string.uri': 'Image url is invalid'
            }),
        }),
    )
    .min(1).max(10).required().messages({
        'array.min': 'You must upload at least one image',
        'any.required': 'Images are required',
    }),

    // userId should typically NOT be updatable, but if it is, it must be optional
    userId: Joi.string()
        .hex()
        .length(24)
        .optional()
        .messages({
            'string.hex': 'userId id must be a valid MongoDB ID',
            'string.length': 'userId id must be a valid MongoDB ID',
        }),

    location: Joi.object({
        type: Joi.string()
            .valid('Point')
            .required()
            .messages({
                'any.required': 'location type is required',
                'any.only': 'Location type must be "Point"',
            }),

        coordinates: Joi.array()
            .items(Joi.number())
            .length(2)
            .required()
            .messages({
                'any.required': 'Coordinates are required',
                'array.length': 'Coordinates must contain exactly 2 numbers (longitude, latitude)',
            }),
    }).optional(), // The location object is optional for updates

    dateCompleted: Joi.date().optional(),
    customerName: Joi.string().optional(),
});