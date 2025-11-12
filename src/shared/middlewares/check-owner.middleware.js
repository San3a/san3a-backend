import AppError from '#src/shared/utils/app-error.js';
import { asyncHandler } from '#src/shared/utils/async-handler.js';

const restrictToOwner = (Model, ownerField = 'user', message = null) =>
    asyncHandler(async (req, res, next) => {
        const doc = await Model.findById(req.params.id);
        if (!doc) {
            return next(new AppError(`${Model.modelName} not found`, 404));
        }

        if (!doc[ownerField]._id.equals(req.user.id)) {
            return next(new AppError(message || 'You are not allowed to perform this action', 403));
        }

        next();
    });

export default restrictToOwner;
