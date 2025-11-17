import {
    addAvailabiltySlots,
    createTechServiceHandler,
    deleteTechServiceHandler,
    getAllTechServicesHandler,
    getTechServiceHandler,
    updateTechServiceHandler,
} from '#src/modules/tech-service/tech-service.controller.js';
import {
    CREATE_TECHSERVICE,
    UPDATE_TECHSERVICE,
    DELETE_TECHSERVICE,
    ADD_TECHSERVICE_AVAILABILTY,
} from '#src/modules/tech-service/endpoints.js';
import { isAuthorized } from '#src/shared/middlewares/authorization.middleware.js';
import express from 'express';
import { upload } from '#src/shared/utils/upload.js';
import { handleImageCreate } from '#src/shared/middlewares/handleImageCreate.js';
import { handleImageUpdate } from '#src/shared/middlewares/handleImageUpdate.js';
import TechService from '#src/modules/tech-service/tech-service.model.js';
import restrictToOwner from '#src/shared/middlewares/check-owner.middleware.js';
import { validate } from '#src/shared/middlewares/validation.middleware.js';
import {
    addAvailabilitySchema,
    createTechServiceSchema,
} from '#src/modules/tech-service/tech-service.validator.js';

const router = express.Router();
router
    .route('/')
    .get(getAllTechServicesHandler)
    .post(
        isAuthorized(CREATE_TECHSERVICE),
        upload.array('images', 5),
        handleImageCreate(TechService),
        validate(createTechServiceSchema),
        createTechServiceHandler
    );
router
    .route('/:id')
    .get(getTechServiceHandler)
    .patch(
        isAuthorized(UPDATE_TECHSERVICE),
        restrictToOwner(TechService),
        handleImageUpdate(TechService),
        validate(updateTechServiceHandler),
        updateTechServiceHandler
    )
    .delete(
        isAuthorized(DELETE_TECHSERVICE),
        restrictToOwner(TechService),
        deleteTechServiceHandler
    );

router
    .route('/:id/availabity')
    .post(
        isAuthorized(ADD_TECHSERVICE_AVAILABILTY),
        restrictToOwner(TechService),
        validate(addAvailabilitySchema),
        addAvailabiltySlots
    );

export default router;
