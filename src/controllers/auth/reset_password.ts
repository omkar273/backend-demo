
import { Request, Response, NextFunction } from 'express';
import asyncHandler from './../../utils/asynchandler.js';
import ApiError from './../../utils/api_error.js';
import User from './../../models/user/user.model.js';
import ApiResponse from './../../utils/api_success.js';


export const resetPassword = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { token, password } = req.body;

        if (!token || !password) {
            throw new ApiError('Token and password are required', 400);
        }

        const user = await User.findOne({
            forgotPasswordToken: token,
            forgotPasswordTokenExpiry: { $gt: new Date() }
        });

        if (!user) {
            throw new ApiError('Invalid or expired token', 401);
        }

        user.password = password;
        user.forgotPasswordToken = undefined;
        user.forgotPasswordTokenExpiry = undefined;
        await user.save({ validateBeforeSave: false });

        res.status(200)
            .json(new ApiResponse({}, "Password reset successfully", 200));
    }
);