/**
 * Role definitions for the dental clinic system
 */
export const ROLES = {
    PATIENT: 'patient',
    DOCTOR: 'doctor',
    ADMIN: 'admin',
    STAFF: 'staff'
};

export const ALL_ROLES = Object.values(ROLES);

export const ROLE_HIERARCHY = {
    [ROLES.PATIENT]: 0,
    [ROLES.STAFF]: 1,
    [ROLES.DOCTOR]: 2,
    [ROLES.ADMIN]: 3
};

export const STAFF_DESIGNATIONS = ['Nurse', 'Receptionist', 'Hygienist', 'Technician'];

export default ROLES;
