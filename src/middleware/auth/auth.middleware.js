import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from '../../utils/api_error.js';
import { User } from '../../models/user.model.js';
import jwt from 'jsonwebtoken';

const verifyJwt = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.headers.authorization.split(' ')[1];

        if (!token) {
            throw new ApiError(401, 'Unauthorized Request');
        }


        const decoded = jwt.verify(token, process.env.ACESS_TOKEN_SECRET);
        const user = await User.findById(decoded?.id).select('-password -emailVerified  -refreshToken -verifyToken -verifyTokenExpires');


        if (!user) {
            throw new ApiError(401, 'Invalid Token');
        }
        req.user = user;

        next();
    } catch (error) {
        console.log(error);
        throw new ApiError(401, 'Unauthorized Request');
    }
})

export default verifyJwt;