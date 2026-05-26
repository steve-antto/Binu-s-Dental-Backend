/**
 * Data normalization utilities
 */

/**
 * Normalize an email address (lowercase + trim)
 */
export const normalizeEmail = (email) => {
    return email ? String(email).toLowerCase().trim() : '';
};

/**
 * Normalize a phone number (remove spaces, dashes, parentheses)
 */
export const normalizePhone = (phone) => {
    return phone ? String(phone).replace(/[\s\-()]/g, '').trim() : '';
};

/**
 * Capitalize the first letter of each word
 */
export const capitalizeWords = (str) => {
    if (!str) return '';
    return str.replace(/\b\w/g, char => char.toUpperCase());
};

/**
 * Strip sensitive fields from a Mongoose document before sending to client
 */
export const sanitizeDocument = (doc, fieldsToRemove = ['__v', 'password']) => {
    const obj = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };
    fieldsToRemove.forEach(field => delete obj[field]);
    return obj;
};

/**
 * Normalize currency amount (ensure 2 decimal places)
 */
export const normalizeCurrency = (amount) => {
    const num = Number(amount);
    return isNaN(num) ? 0 : Math.round(num * 100) / 100;
};

export default {
    normalizeEmail,
    normalizePhone,
    capitalizeWords,
    sanitizeDocument,
    normalizeCurrency
};
