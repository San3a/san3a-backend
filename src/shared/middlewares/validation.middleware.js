import { StatusCodes } from 'http-status-codes';

export const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error)
        return res.status(StatusCodes.BAD_REQUEST).json({ message: error.details[0].message });
    next();
};
