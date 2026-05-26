export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
export const APPOINTMENT_STATUSES = ['scheduled', 'completed', 'cancelled', 'no-show'];
export const APPOINTMENT_SOURCES = ['website', 'admin', 'walk-in'];
export const TREATMENT_TYPES = ['rootcanal', 'dental_crown', 'implants', 'extraction_impaction', 'cleaning', 'other'];
export const PAYMENT_METHODS = ['Cash', 'GPay', 'Card', 'UPI', 'Bank Transfer'];
export const INVOICE_STATUSES = ['pending', 'partial', 'paid'];
export const REMINDER_CHANNELS = ['whatsapp', 'sms', 'email', 'telegram'];
export const REMINDER_TYPES = ['upcoming_appointment', 'follow_up', 'payment_due'];
export const DOCUMENT_TYPES = ['xray', 'prescription', 'consent_form', 'other'];
export const TIMELINE_EVENT_TYPES = ['appointment', 'treatment', 'billing', 'payment', 'document', 'note'];
export const API_PREFIX = '/api/v1';

export default {
    DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, APPOINTMENT_STATUSES, APPOINTMENT_SOURCES,
    TREATMENT_TYPES, PAYMENT_METHODS, INVOICE_STATUSES, REMINDER_CHANNELS,
    REMINDER_TYPES, DOCUMENT_TYPES, TIMELINE_EVENT_TYPES, API_PREFIX
};
