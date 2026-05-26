import Treatment from '../models/treatments.model.js';

export const findTreatmentById = async (id) => Treatment.findById(id).populate('patientId', 'name phone').select('-__v');
export const findTreatmentsByQuery = async (query) => Treatment.find(query).populate('patientId', 'name phone').sort({ createdAt: -1 });
export const createTreatment = async (data) => Treatment.create(data);
export const updateTreatmentById = async (id, data) => Treatment.findByIdAndUpdate(id, data, { new: true }).populate('patientId', 'name phone');
export const findTreatmentsByPatient = async (patientId) => Treatment.find({ patientId }).populate('appointmentId', 'date time').sort({ createdAt: -1 });

export default { findTreatmentById, findTreatmentsByQuery, createTreatment, updateTreatmentById, findTreatmentsByPatient };
