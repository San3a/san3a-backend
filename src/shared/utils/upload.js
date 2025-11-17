import AppError from '#src/shared/utils/app-error.js';
import multer from 'multer';

export const upload = multer({
    storage: multer.diskStorage({}),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        console.log(`This is the body for post: ${JSON.stringify(req.body)}`);
        console.log(`These are the files: ${file.originalname}`);

        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            const appError = new AppError('This field only accepts image!', 400);
            return cb(appError, false);
        }

        return cb(null, true);
    },
});
