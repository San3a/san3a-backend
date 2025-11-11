import PastWork from '#src/modules/past-work/past-work-model.js';
import { createOneWithImages, deleteOne, getOne, updateOne } from '#src/shared/services/handler-factory.js';

// TODO: Get User Past work (at user controller)

export const getPastWork = getOne(PastWork);

export const createPastWork = createOneWithImages(PastWork);

export const deletePastWork = deleteOne(PastWork);

export const updatePastWork = updateOne(PastWork);