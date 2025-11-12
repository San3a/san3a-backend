import cloudinaryV2 from '#src/config/cloudinary.js';
import AppError from '#src/shared/utils/app-error.js';
import { asyncHandler } from '#src/shared/utils/async-handler.js';

export const handleImageUpdate = (Model) => 
    asyncHandler(async(req, res, next) => {
    if (req.files && req.files.length > 0) {
            let updatedImages = [];
            const images = [];
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
            )
            .then(async () => {
                const item = await Model.findById(req.params.id);
                if (!item) {
                    return next(new AppError(`No ${Model.modelName} found with that ID`, 404));
                }

                updatedImages = [...item.images, ...images];
                req.body.images = updatedImages;
            });
        }
    next();
})