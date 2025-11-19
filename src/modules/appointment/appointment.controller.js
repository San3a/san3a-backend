import * as factory from '#src/shared/services/handler-factory.js';
import Appointment from './appointment.model.js';

export const createAppointment = factory.createOne(Appointment);
export const getAllAppointments = factory.getAll(Appointment);
export const getAppointment = factory.getOne(Appointment);
export const updateAppointment = factory.updateOne(Appointment);
export const deleteAppointment = factory.deleteOne(Appointment);
