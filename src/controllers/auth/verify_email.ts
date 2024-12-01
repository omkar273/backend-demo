
import asyncHandler from "../../utils/asynchandler.js";
import { Request, Response, NextFunction } from 'express';
import ApiError from "../../utils/api_error.js";
import { User } from "../../models/user/user.model.js";
import ApiResponse from "../../utils/api_success.js";

export const verifyEmail = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const token = req.params.token;
        console.log('token', token);

        if (!token) {
            throw new ApiError('Invalid Token', 401);
        }

        const user = await User.findOne({
            verifyToken: token,
            verifyTokenExpiry: { $gt: new Date() }
        });


        if (!user) {
            throw new ApiError('Token Expired', 401);
        }

        user.emailVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;
        await user.save({ validateBeforeSave: false });

        res.status(200)
            .json(new ApiResponse({}, "Email verified successfully", 200));
    }
)


