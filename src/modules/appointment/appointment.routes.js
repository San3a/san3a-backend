import express from 'express';
import {
    CREATE_APPOINTMENT,
    GET_ALL_APPOINTMENTS,
    GET_APPOINTMENT,
    UPDATE_APPOINTMENT_STATUS,
} from './endpoints.js';
import {
    createAppointment,
    deleteAppointment,
    getAllAppointments,
    getAppointment,
    updateAppointment,
} from './appointment.controller.js';
import { isAuthorized } from '#src/shared/middlewares/authorization.middleware.js';

const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(isAuthorized(GET_ALL_APPOINTMENTS), getAllAppointments)
    .post(isAuthorized(CREATE_APPOINTMENT), createAppointment);

router
    .route('/:id')
    .get(isAuthorized(GET_APPOINTMENT), getAppointment)
    .patch(isAuthorized(UPDATE_APPOINTMENT_STATUS), updateAppointment)
    .delete(deleteAppointment);

export default router;
