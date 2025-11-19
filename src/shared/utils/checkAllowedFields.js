import AppError from '#src/shared/utils/app-error.js';
import { StatusCodes } from 'http-status-codes';

const checkAllowedFields = (req, res, next) => 
    (obj, ...allowedFields) => {
    Object.keys(obj).forEach((el) => {
        if (!allowedFields.includes(el)) {
            return next(
                new AppError (
                    'Cannot update this field',
                    StatusCodes.BAD_REQUEST
                )
            );
        }
    });

    return true;
};

export default checkAllowedFields;