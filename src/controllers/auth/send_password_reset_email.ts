
import asyncHandler from './../../utils/asynchandler.js';
import { Request, Response, NextFunction } from 'express';
import ApiError from './../../utils/api_error.js';
import User from './../../models/user/user.model.js';
import sendEmail from './../../utils/send_email.js';
import ApiResponse from './../../utils/api_success.js';

export const sendPasswordResetEmail = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { email } = req.body;

        if (!email) {
            throw new ApiError('Email is required', 400);
        }

        const user = await User.findOne({ email });

        if (!user) {
            throw new ApiError('User not found', 404);
        }

        const resetToken = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
        const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);  // 10 minutes from now

        user.forgotPasswordToken = resetToken;
        user.forgotPasswordTokenExpiry = resetTokenExpiry;
        await user.save({ validateBeforeSave: false });

        const resetUrl = `${req.protocol}://${req.get('host')}/auth/reset-password/${resetToken}`;

        // TODO : ADD beautiful html structure for forgot password email
        await sendEmail({
            email: user.email,
            subject: `Password Reset for ${user.fullname}`,
            text: `Your password reset token is ${resetToken}`,
            html: `<a href="${resetUrl}">Reset Password</a>`,
        });

        res.status(200)
            .json(new ApiResponse({}, "Reset token sent to email", 200));
    }
);