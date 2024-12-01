import { CookieOptions, Request, Response } from 'express';
import asyncHandler from './../../utils/asynchandler.js';
import ApiError from './../../utils/api_error.js';
import User from '../../models/user/user.model.js';
import ApiResponse from './../../utils/api_success.js';
import generateAcessAndRefreshTokens from './utils/generate_tokens.js';


export const loginUser = asyncHandler(
    async (req: Request, res: Response) => {

        const role = req.role;
        if (!role) {
            throw new ApiError('Role is required', 400);
        }

        const { phone, email, password, otp } = req.body;

        if (!phone || !email) {
            throw new ApiError('Phone or email is required', 400);
        }

        const user = await User.findOne({
            $or: [
                { email: email },
                { phone: phone }
            ]
        }).select('+password +_id +phone');

        if (!user) {
            throw new ApiError("User does not exist", 303);
        }

        if (!user || !(await user.isPasswordValid(password))) {
            throw new ApiError('Invalid email or password', 401);
        }

        if (!user) {
            throw new ApiError('Email not verified', 401);
        }

        const { accessToken, refreshToken } = await generateAcessAndRefreshTokens(user._id.toString());

        const updatedUser = await User.findById(
            user._id,
        ).select('-password -refreshToken -verifyToken -verifyTokenExpiry');


        const cookieOptions: CookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            // expires: new Date(Date.now() + * 24 * 60 * 60 * 1000),
        };


        res.status(200)
            .cookie('refreshToken', refreshToken, cookieOptions)
            .cookie('accessToken', accessToken, cookieOptions)
            .json(new ApiResponse({ accessToken, refreshToken, user: updatedUser }, "User logged in successfully", 200));
    }
)