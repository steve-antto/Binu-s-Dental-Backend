import Invoice from '../models/invoice.model.js';

export const findInvoiceById = async (id) => Invoice.findById(id).populate('patientId', 'name phone email').select('-__v');
export const findInvoicesByQuery = async (query) => Invoice.find(query).populate('patientId', 'name phone email').sort({ createdAt: -1 });
export const createInvoice = async (data) => Invoice.create(data);
export const updateInvoiceById = async (id, data) => Invoice.findByIdAndUpdate(id, data, { new: true }).populate('patientId', 'name phone email');

export default { findInvoiceById, findInvoicesByQuery, createInvoice, updateInvoiceById };
