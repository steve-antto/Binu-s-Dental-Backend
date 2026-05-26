import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
const IV_LENGTH = 16;

/**
 * Encrypt a plaintext string
 * @param {string} text - Text to encrypt
 * @returns {string} - Encrypted string (iv:encrypted)
 */
export const encrypt = (text) => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = Buffer.from(ENCRYPTION_KEY, 'hex');
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return `${iv.toString('hex')}:${encrypted}`;
};

/**
 * Decrypt an encrypted string
 * @param {string} encryptedText - Encrypted string (iv:encrypted)
 * @returns {string} - Decrypted plaintext
 */
export const decrypt = (encryptedText) => {
    const [ivHex, encrypted] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const key = Buffer.from(ENCRYPTION_KEY, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
};

/**
 * Hash a string using SHA-256 (one-way, non-reversible)
 * @param {string} text - Text to hash
 * @returns {string} - Hex hash
 */
export const hashSHA256 = (text) => {
    return crypto.createHash('sha256').update(text).digest('hex');
};

export default { encrypt, decrypt, hashSHA256 };
