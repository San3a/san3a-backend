import Joi from 'joi';

export const createReviewSchema = Joi.object({
    rating: Joi.number().min(0).max(5).required().messages({
        'any.required': 'Review rating is required',
        'number.min': 'Review must be greater than or equal 0',
        'number.max': 'Review must be less than or equal 5'
    }),

    review: Joi.string().trim().required().messages({
        'any.required': 'Review is required',
        'string.empty': 'Review is required',
    }),

    techService: Joi.string().hex().length(24).required().messages({
        'any.required': 'techService id is required',
        'string.empty': 'techService id is required',
        'string.hex': 'techService id must be a valid MongoDB ID',
        'string.length': 'techService id must be a valid MongoDB ID',
    }),

    user: Joi.string().hex().length(24).required().messages({
        'any.required': 'user id is required',
        'string.empty': 'user id is required',
        'string.hex': 'user id must be a valid MongoDB ID',
        'string.length': 'user id must be a valid MongoDB ID',
    }),
});

export const updateReviewSchema = Joi.object({
    rating: Joi.number().min(0).max(5).optional().messages({
        'any.required': 'Review rating is required',
        'number.min': 'Review must be greater than or equal 0',
        'number.max': 'Review must be less than or equal 5'
    }),

    review: Joi.string().trim().optional().messages({
        'any.required': 'Review is required',
        'string.empty': 'Review is required',
    }),

    techService: Joi.string().hex().length(24).optional().messages({
        'any.required': 'techService id is required',
        'string.empty': 'techService id is required',
        'string.hex': 'techService id must be a valid MongoDB ID',
        'string.length': 'techService id must be a valid MongoDB ID',
    }),

    user: Joi.string().hex().length(24).optional().messages({
        'any.required': 'user id is required',
        'string.empty': 'user id is required',
        'string.hex': 'user id must be a valid MongoDB ID',
        'string.length': 'user id must be a valid MongoDB ID',
    }),
});