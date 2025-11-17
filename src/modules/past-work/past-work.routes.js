import { CREATE_PASTWORK } from '#src/modules/past-work/endpoints.js';
import { createPastWork, deletePastWork, getPastWork, updatePastWork } from '#src/modules/past-work/past-work.controller.js';
import PastWork from '#src/modules/past-work/past-work.model.js';
import { createPastWorkSchema, updatePastWorkSchema } from '#src/modules/past-work/past-work.validator.js';
import { addUserId } from '#src/shared/middlewares/addUserId.js';
import { isAuthorized } from '#src/shared/middlewares/authorization.middleware.js';
import { handleImageCreate } from '#src/shared/middlewares/handleImageCreate.js';
import { handleImageUpdate } from '#src/shared/middlewares/handleImageUpdate.js';
import { validate } from '#src/shared/middlewares/validation.middleware.js';
import { upload } from '#src/shared/utils/upload.js';
import express from 'express';
const router = express.Router();

router.route('/')
    .post(
        isAuthorized(CREATE_PASTWORK),
        upload.array('images', 10), 
        addUserId,
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