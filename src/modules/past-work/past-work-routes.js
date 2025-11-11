import { createPastWork, deletePastWork, getPastWork, updatePastWork } from '#src/modules/past-work/past-work-controller.js';
import { upload } from '#src/shared/utils/upload.js';
import express from 'express';
const router = express.Router();

router.route('/')
    .post(upload.array('images', 10), createPastWork);

router.route('/:id')
    .get(getPastWork)
    .delete(deletePastWork)
    .patch(upload.array('images', 10), updatePastWork);


export default router;