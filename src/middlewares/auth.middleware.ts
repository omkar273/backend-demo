import { Request, Response, NextFunction } from 'express';
import asyncHandler from "../utils/asynchandler.js";
import ApiError from '../utils/api_error.js';
import jwt from 'jsonwebtoken';
import { User } from '../models/user/user.model.js';

export const verifyJwt = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {

        const token = req.cookies?.accessToken || req.headers.authorization.split(' ')[1];

        if (!token) {
            throw new ApiError('Unauthorized Request', 401,);
        }

        const decoded = jwt.verify(token, process.env.ACESS_TOKEN_SECRET) as { id: string };
        const user = await User.findById(decoded?.id).select('-password -emailVerified  -refreshToken -verifyToken -verifyTokenExpiry');



        if (!user) {
            throw new ApiError('Invalid Token', 401);
        }

        req.user = user;
        next();
    }
)