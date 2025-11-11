import joi from 'joi';

const createOfferSchema = joi.object({
    post: joi.string().hex().length(24).required().label('Post Id'),
    technician: joi.string().hex().length(24).required().label('Technician Id'),
    price: joi.number().min(0).required().label('Price'),
    message: joi.string().required().label('Message'),
});

const updateOfferSchema = joi
    .object({
        price: joi.number().min(0).label('Price'),
        message: joi.string().label('Message'),
    })
    .min(1);

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const errors = error.details.map((d) => d.message);
        return res.status(400).json({ status: 'fail', errors });
    }
    next();
};

export const validateCreateOffer = validate(createOfferSchema);
export const validateUpdateOffer = validate(updateOfferSchema);
