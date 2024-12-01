import asyncHandler from '../../utils/asynchandler.js';
import { Request, Response, NextFunction } from 'express';
import ApiError from '../../utils/api_error.js';
import { User } from '../../models/user/user.model.js';
import sendEmail from '../../utils/send_email.js';
import ApiResponse from '../../utils/api_success.js';

export const sendVerificationEmail = asyncHandler(
    async (req: Request, res: Response) => {
        const { email } = req.body;

        if (!email) {
            throw new ApiError('Email is required', 400);
        }

        const user = await User.findOne({ email });

        if (!user) {
            throw new ApiError('User not found', 404);
        }

        const verifyToken = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
        const verifyTokenExpiry = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);  // 10 minutes from now

        user.verifyToken = verifyToken;
        user.verifyTokenExpiry = verifyTokenExpiry;
        await user.save({ validateBeforeSave: false });

        const resetUrl = `${req.protocol}://${req.get('host')}/auth/verify-email/${verifyToken}`;

        // TODO : ADD beautiful html structure for verification email
        await sendEmail({
            email: user.email,
            subject: ` for ${user.fullname}`,
            html: `<a href="${resetUrl}">Verify your account</a>  
            your verification token is ${verifyToken}`,
        });

        res.status(200)
            .json(new ApiResponse({}, "Reset token sent to email", 200));
    }
);