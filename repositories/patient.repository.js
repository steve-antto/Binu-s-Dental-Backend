import Patient from '../models/patients.model.js';

export const findPatientByUserId = async (userId) => Patient.findOne({ userId }).populate('userId', 'name email').select('-__v');
export const findPatientById = async (id) => Patient.findById(id).populate('userId', 'name email').select('-__v');
export const createPatient = async (patientData) => Patient.create(patientData);
export const updatePatient = async (id, updateData) => Patient.findByIdAndUpdate(id, updateData, { new: true }).populate('userId', 'name email').select('-__v');
export const getAllPatients = async () => Patient.find().populate('userId', 'name email phone').select('-__v').sort({ createdAt: -1 });

export default { findPatientByUserId, findPatientById, createPatient, updatePatient, getAllPatients };
