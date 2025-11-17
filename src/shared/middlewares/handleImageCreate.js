import cloudinaryV2 from '#src/config/cloudinary.js';
import AppError from '#src/shared/utils/app-error.js';
import { asyncHandler } from '#src/shared/utils/async-handler.js';

export const handleImageCreate = (Model) =>
    asyncHandler(async (req, res, next) => {
        const images = [];
        if (!req.files || req.files.length === 0) {
            const err = new AppError('You had to upload at least one image', 400);
            return next(err);
        }

        await Promise.all(
            req.files.map(async (file) => {
                const result = await cloudinaryV2.uploader.upload(file.path, {
                    folder: Model.modelName,
                });
                images.push({
                    url: result.secure_url,
                    public_id: result.public_id,
                });
            })
        );
        req.body.images = images;
        next();
    });
