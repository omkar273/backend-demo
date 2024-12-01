import asyncHandler from './../../utils/asynchandler.js';
import { Request, Response, NextFunction } from 'express';
import { IUser } from './../../models/user/user.model';
import ApiResponse from './../../utils/api_success.js';

export const getUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const user = req.user as IUser & Document;

        res.status(200)
            .json(new ApiResponse({ user }, "User fetched successfully", 200));
    }
)
