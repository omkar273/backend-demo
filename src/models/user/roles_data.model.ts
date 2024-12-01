import { Document, model, Schema } from 'mongoose';




export interface IRoleData extends Document {
    role: 'user' | 'admin' | 'superadmin' | 'vendor' | 'partner';
    doc_id: any;
    emailVerified: boolean;
    phoneVerified: boolean;
    verifyToken?: string;
    verifyTokenExpiry?: Date;
}

/**
 * Schema definition for role data.
 * 
 * @typedef {Object} IRoleData
 * @property {string} role - The role of the user. Must be one of 'user', 'admin', 'superadmin', 'vendor', 'partner'. Default is 'user'.
 * @property {Schema.Types.Mixed} [doc_id] - An optional document ID associated with the user.
 * @property {boolean} [emailVerified=false] - Indicates whether the user's email is verified. Default is false.
 * @property {boolean} [phoneVerified=false] - Indicates whether the user's phone number is verified. Default is false.
 * @property {string} [verifyToken] - A token used for verification purposes.
 * @property {Date} [verifyTokenExpiry] - The expiry date of the verification token.
 * 
 * @type {Schema<IRoleData>}
 * @property {Object} timestamps - Automatically manages createdAt and updatedAt properties.
 */


const roleDataSchema = new Schema<IRoleData>({
    role: {
        type: String,
        required: true,
        enum: ['user', 'admin', 'superadmin', 'vendor', 'partner', 'customer'],
        default: 'user',
    },

    doc_id: {
        type: Schema.Types.Mixed,
        required: false,
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    phoneVerified: {
        type: Boolean,
        default: false,
    },
    verifyToken: {
        type: String,
    },
    verifyTokenExpiry: {
        type: Date,
    },
}, { timestamps: true });

// Export the model using the defined schema
export const RoleData = model<IRoleData>('RoleData', roleDataSchema);
