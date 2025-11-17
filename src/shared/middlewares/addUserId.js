import { asyncHandler } from '#src/shared/utils/async-handler.js'

export const addUserId  = asyncHandler(async (req, res, next) => {
        if(req.user) {
            req.body.userId = req?.user?._id.toString();
        }
        next();
    });
