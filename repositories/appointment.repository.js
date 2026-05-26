import Appointment from '../models/appointments.model.js';

export const findAppointmentById = async (id) => Appointment.findById(id).populate('patientId', 'name phone email').select('-__v');
export const findAppointmentsByQuery = async (query, sortBy = { date: 1, time: 1 }) => Appointment.find(query).populate('patientId', 'name phone email').sort(sortBy);
export const createAppointment = async (data) => Appointment.create(data);
export const updateAppointmentById = async (id, data) => Appointment.findByIdAndUpdate(id, data, { new: true }).populate('patientId', 'name phone');
export const countAppointmentsByDate = async (dateString) => Appointment.countDocuments({ date: dateString });

export default { findAppointmentById, findAppointmentsByQuery, createAppointment, updateAppointmentById, countAppointmentsByDate };
