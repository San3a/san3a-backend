import TechService from '#src/modules/tech-service/tech-service.model.js';
import * as factory from '#src/shared/services/handler-factory.js';

export const getAllTechServicesHandler = factory.getAll(TechService);
export const getTechServiceHandler = factory.getOne(TechService);
export const updateTechServiceHandler = factory.updateOne(TechService);
export const deleteTechServiceHandler = factory.deleteOne(TechService);
export const createTechServiceHandler = factory.createOne(TechService);
