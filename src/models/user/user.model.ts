import { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { AuthProvider } from '../../constants/enums/auth_providers.js';

/**
 * Interface representing a User document.
 * 
 * @interface IUser
 * @extends {Document}
 * 
 * @property {string} email - The email address of the user.
 * @property {string} password - The hashed password of the user.
 * @property {string} fullname - The full name of the user.
 * @property {Array<'user' | 'admin' | 'superadmin' | 'vendor' | 'partner'|'customer'>} roles - The roles assigned to the user.
 * @property {Date} createdAt - The date when the user was created.
 * @property {Date} updatedAt - The date when the user was last updated.
 * @property {string | null} avatar - The URL of the user's avatar image or null if not set.
 * @property {string} [referralCode] - The referral code associated with the user (optional).
 * @property {string} [avatarUrl] - The URL of the user's avatar image (optional).
 * @property {string | null} phone - The phone number of the user or null if not set.
 * @property {string} [resetPasswordToken] - The token used for resetting the user's password (optional).
 * @property {Date} [resetPasswordTokenExpiry] - The expiry date of the reset password token (optional).
 * 
 * @method isPasswordValid
 * @description Checks if the provided password is valid.
 * @param {string} password - The password to validate.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating if the password is valid.
 * 
 * @method generateAccessToken
 * @description Generates a new access token for the user.
 * @returns {string} - The generated access token.
 * 
 * @method generateRefreshToken
 * @description Generates a new refresh token for the user.
 * @returns {string} - The generated refresh token.
 */
export interface IUser extends Document {
    email: string;
    password: string;
    fullname: string;
    roles: Array<'user' | 'admin' | 'superadmin' | 'vendor' | 'partner' | 'customer'>;
    createdAt: Date;
    updatedAt: Date;
    avatar: string | null;
    referralCode?: string;
    provider: string;
    avatarUrl?: string;
    phone: string | null;
    resetPasswordToken?: string;
    resetPasswordTokenExpiry?: Date;
    isPasswordValid(password: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string;
}

export interface AccessToken {
    id: string;
    // email: string;
    role: 'user' | 'admin' | 'superadmin' | 'vendor' | 'partner' | 'customer';
}




/**
 * User schema definition for MongoDB using Mongoose.
 * 
 * @typedef {Object} IUser
 * @property {string} email - The user's email address. Required, unique, lowercase, trimmed, and indexed.
 * @property {string} password - The user's password. Required.
 * @property {string} fullname - The user's full name. Required and trimmed.
 * @property {string} [avatar] - The user's avatar URL.
 * @property {string[]} roles - The roles assigned to the user. Can be "user", "admin", "superadmin", "vendor", or "partner". Defaults to ["user"].
 * @property {string} [avatarUrl] - The URL of the user's avatar.
 * @property {string} [referralCode] - The referral code associated with the user.
 * @property {string} [phone] - The user's phone number.
 * @property {string} [resetPasswordToken] - Token used for resetting the user's password.
 * @property {Date} [resetPasswordTokenExpiry] - Expiry date for the reset password token.
 * 
 * @property {Date} createdAt - Timestamp indicating when the user was created.
 * @property {Date} updatedAt - Timestamp indicating when the user was last updated.
 */
const userSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        fullname: {
            type: String,
            required: [true, "Fullname is required"],
            trim: true,
        },
        avatar: {
            type: String,
        },
        roles: {
            type: [String],
            enum: ["user", "admin", "superadmin", "vendor", "partner", 'customer'],
            default: ["user"],
        },
        avatarUrl: {
            type: String,
        },

        referralCode: {
            type: String,
        },
        phone: {
            type: String,
        },
        provider: {
            type: String,
            default: AuthProvider.EMAIL,
        },
        resetPasswordToken: {
            type: String,
        },
        resetPasswordTokenExpiry: {
            type: Date,
        },

    },
    { timestamps: true }
);


// Hash the password before saving
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

// Password validation method
userSchema.methods.isPasswordValid = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function (role: string) {
    return jwt.sign(
        {
            id: this._id,
            role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

// Generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_SECRET_EXPIRY,
        }
    );
};

export const User = mongoose.model<IUser>("User", userSchema);
export default User;