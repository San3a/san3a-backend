import PastWork from '#src/modules/past-work/past-work.model.js';
import { createOne, deleteOne, getOne, updateOne } from '#src/shared/services/handler-factory.js';

export const getPastWork = getOne(PastWork);

export const createPastWork = createOne(PastWork);

export const deletePastWork = deleteOne(PastWork);

export const updatePastWork = updateOne(PastWork);
