import Timeline from '../models/timeline.model.js';

/**
 * Adds an event to a patient's timeline.
 * * @param {String} patientId - The MongoDB ObjectId of the patient
 * @param {String} eventType - e.g., 'appointment', 'treatment', 'billing'
 * @param {String} description - Human readable description
 * @param {Object} meta - Any related IDs (invoiceId, treatmentId)
 */
export const addTimelineEvent = async (patientId, eventType, description, meta = {}) => {
    try {
        const event = await Timeline.create({
            patientId,
            eventType,
            description,
            meta,
            eventDate: new Date()
        });

        return event;
    } catch (error) {
        console.error('Failed to create timeline event:', error);
        // We usually don't throw here so we don't break the main transaction (like creating an invoice)
        // just because the timeline log failed.
        return null;
    }
};