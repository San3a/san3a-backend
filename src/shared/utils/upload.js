import AppError from '#src/shared/utils/app-error.js';
import multer from 'multer';

export const upload = multer({
    storage: multer.diskStorage({}),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            const appError = new AppError('This field only accepts image!', 400);
            return cb(appError, false);
        }

        return cb(null, true);
    }
});