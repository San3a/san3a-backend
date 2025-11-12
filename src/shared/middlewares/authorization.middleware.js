import AppError from '#src/shared/utils/app-error.js';
import { asyncHandler } from '#src/shared/utils/async-handler.js';
import jwt from 'jsonwebtoken';
import rbac from '#src/shared/rbac/rbac.js';
import { StatusCodes } from 'http-status-codes';
import User from '#src/modules/user/user.model.js';

export const isAuthorized = (endpoint) =>
    asyncHandler(async (req, res, next) => {
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            const token = req.headers.authorization.split(' ')[1];
            if (!token)
                next(
                    new AppError(
                        'You are not logged in, please login to pursued',
                        StatusCodes.UNAUTHORIZED
                    )
                );
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // check if user exists on db
            console.log(`This is decoded: ${decoded.id}`);
            const user = await User.findOne({ _id: decoded.id });
            if (!user) next(new AppError('User not found', StatusCodes.UNAUTHORIZED));
            // check if user changed his password after init the token
            if (user.passwordChangedAt) {
                const passwordChangedAtTimeStamp = parseInt(
                    user.passwordChangedAt.getTime() / 1000,
                    10
                );
                if (passwordChangedAtTimeStamp > decoded.iat)
                    next(
                        new AppError('Token Expired, please login again', StatusCodes.UNAUTHORIZED)
                    );
            }
            req.user = user;
            const isAuth = await rbac.can(user.role, endpoint);
            if (!isAuth) next(new AppError('Unauthorized', StatusCodes.FORBIDDEN));
            next();
        } else {
            next(new AppError('Unauthorized', StatusCodes.UNAUTHORIZED));
        }
    });
