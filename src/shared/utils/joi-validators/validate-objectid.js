import mongoose from 'mongoose';
import Joi from 'joi';

const objectId = (label) =>
    Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .messages({
            'any.invalid': `${label} must be a valid MongoDB ObjectId`,
        });
export default objectId;
