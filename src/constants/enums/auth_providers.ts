/**
 * Enum representing various authentication providers.
 * 
 * @enum {string}
 * @property {string} EMAIL - Authentication via email.
 * @property {string} PHONE - Authentication via phone.
 * @property {string} GOOGLE - Authentication via Google.
 * @property {string} FACEBOOK - Authentication via Facebook.
 * @property {string} GITHUB - Authentication via GitHub.
 * @property {string} TWITTER - Authentication via Twitter.
 * @property {string} LINKEDIN - Authentication via LinkedIn.
 */
export enum AuthProvider {
    EMAIL = 'email',
    PHONE = 'phone',
    GOOGLE = 'google',
    FACEBOOK = 'facebook',
    GITHUB = 'github',
    TWITTER = 'twitter',
    LINKEDIN = 'linkedin',
}