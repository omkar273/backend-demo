/**
 * Enum representing the various roles a user can have within the system.
 * 
 * @enum {string}
 * @property {string} CUSTOMER - Represents a customer role.
 * @property {string} USER - Represents a general user role.
 * @property {string} ADMIN - Represents an admin role.
 * @property {string} SUPERADMIN - Represents a super admin role.
 * @property {string} VENDOR - Represents a vendor role.
 * @property {string} PARTNER - Represents a partner role.
 */
export enum UserRole {
    CUSTOMER = 'customer',
    USER = 'user',
    ADMIN = 'admin',
    SUPERADMIN = 'superadmin',
    VENDOR = 'vendor',
    PARTNER = 'partner',
}

