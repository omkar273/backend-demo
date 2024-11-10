import { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from 'mongoose';

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    fullname: {
        type: String,
        required: [true, 'Fullname is required'],
        trim: true,
    },
    avtar: {
        type: String,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    refreshToken: {
        type: String,
    },
    avatarUrl: {
        type: String,
    },
    verifyToken: {
        type: String,
    },
    verifyTokenExpires: {
        type: Date,
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

// hash the password
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
})

userSchema.methods.isPasswordValid = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAcessToken = function () {
    return jwt.sign(
        {
            id: this._id,
            email: this.email
        },
        process.env.ACESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACESS_TOKEN_EXPIRY

        }
    );
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_SECRET_EXPIRY

        }
    );
}


export const User = mongoose.model('User', userSchema);