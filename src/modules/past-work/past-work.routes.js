import { createPastWork, deletePastWork, getPastWork, updatePastWork } from '#src/modules/past-work/past-work.controller.js';
import PastWork from '#src/modules/past-work/past-work.model.js';
import { createPastWorkSchema, updatePastWorkSchema } from '#src/modules/past-work/past-work.validator.js';
import { handleImageCreate } from '#src/shared/middlewares/handleImageCreate.js';
import { handleImageUpdate } from '#src/shared/middlewares/handleImageUpdate.js';
import { validate } from '#src/shared/middlewares/validation.middleware.js';
import { upload } from '#src/shared/utils/upload.js';
import express from 'express';
const router = express.Router();

router.route('/')
    .post(
        upload.array('images', 10), 
        handleImageCreate(PastWork), 
        validate(createPastWorkSchema),
        createPastWork
    );

router.route('/:id')
    .get(getPastWork)
    .delete(deletePastWork)
    .patch(
        upload.array('images', 10), 
        handleImageUpdate(PastWork), 
        /*validate(updatePastWorkSchema),*/
        updatePastWork
    );


export default router;