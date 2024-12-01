import asyncHandler from './../../utils/asynchandler.js';
import { Request, Response, NextFunction } from 'express';
import { IUser } from './../../models/user/user.model.js';
import ApiResponse from './../../utils/api_success.js';

export const logoutUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const user = req.user as IUser & Document;

        user.refreshToken = '';
        await (user as any).save({ validateBeforeSave: false });

        res.status(200)
            .clearCookie('refreshToken')
            .clearCookie('accessToken')
            .json(new ApiResponse({}, "User logged out successfully", 200));
    }
)
