import Appointment from './appointment.model.js';

export const createAppointment = (data) => Appointment.create(data);

export const markAppointmentPaid = (id) =>
    Appointment.findByIdAndUpdate(id, { status: 'paid' }, { new: true });

export const getAppointmentById = (id) => Appointment.findById(id).populate('customer technician');
