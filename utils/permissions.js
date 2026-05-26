import { ROLES } from '../config/roles.js';

/**
 * Check if a user has a specific role
 */
export const hasRole = (user, role) => {
    return user && user.role === role;
};

/**
 * Check if a user has any of the specified roles
 */
export const hasAnyRole = (user, roles) => {
    return user && roles.includes(user.role);
};

/**
 * Check if user is an admin
 */
export const isAdmin = (user) => hasRole(user, ROLES.ADMIN);

/**
 * Check if user is a doctor
 */
export const isDoctor = (user) => hasRole(user, ROLES.DOCTOR);

/**
 * Check if user is a patient
 */
export const isPatient = (user) => hasRole(user, ROLES.PATIENT);

/**
 * Check if user can access a specific patient's data
 * Admins and doctors can access any patient, patients can only access their own
 */
export const canAccessPatientData = (user, patientId) => {
    if (isAdmin(user) || isDoctor(user)) return true;
    return user._id.toString() === patientId.toString();
};

export default { hasRole, hasAnyRole, isAdmin, isDoctor, isPatient, canAccessPatientData };
