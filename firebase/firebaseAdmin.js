import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Initialize Firebase Admin SDK
 * Uses the serviceAccountKey.json file in this directory.
 * If GOOGLE_APPLICATION_CREDENTIALS is set, it will use that instead.
 */
if (!admin.apps.length) {
    try {
        const serviceAccountPath = join(__dirname, 'serviceAccountKey.json');
        const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });

        console.log('Firebase Admin SDK initialized successfully.');
    } catch (error) {
        // Fallback to application default credentials (e.g., GOOGLE_APPLICATION_CREDENTIALS env var)
        console.warn('serviceAccountKey.json not found, falling back to applicationDefault()');
        admin.initializeApp({
            credential: admin.credential.applicationDefault()
        });
    }
}

export default admin;
