/**
 * The above TypeScript code defines functions for user registration, login, logout, email
 * verification, and token generation in an Express application.
 * @param {string} userId - The `userId` parameter in the `generateAcessAndRefreshTokens` function is a
 * string representing the unique identifier of a user. This identifier is used to fetch the user from
 * the database and generate access and refresh tokens for that user.
 * @returns The code snippet provided includes several functions related to user authentication and
 * authorization in an Express application. Here is a summary of what each function does:
 */
import asyncHandler from "../../asynchandler.js";
import { Request, Response, NextFunction, CookieOptions } from 'express';
import ApiError from "../../utils/api_error.js";
import { IUser, User } from "../../models/user/user.model.js";
import ApiResponse from "../../utils/api_success.js";
import CryptoJS from "crypto-js";
import sendEmail from "../../utils/send_email.js";

const generateAcessAndRefreshTokens = async (userId: string): Promise<{
    accessToken: string;
    refreshToken: string;
}> => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError('User Not Found', 404);
        }

        const accessToken = user.generateAcessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError('Something Went Wrong While Generating Token', 500);
    }
}

export const registerUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {

        const { email, password, fullname } = req.body;

        // check for missing fields
        [email, password, fullname].some((field) => {
            if (!field) {
                res.status(400);
                throw new ApiError("Missing fields", 301);
            }
        });

        // check for existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new ApiError("User already exists", 302);
        }

        // Generate verification token and expiry
        const verifyToken = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
        const verifyTokenExpiry = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);  // 2 days from now

        const user = await User.create({
            email,
            password,
            fullname,
            verifyToken,
            verifyTokenExpiry,
        })

        const createdUser = await User
            .findById(user._id)
            .select("-password -refreshToken -verifyToken -verifyTokenExpiry");

        if (!createdUser) {
            throw new ApiError("Some error occured while ", 404);
        }

        res.status(200)
            .json(new ApiResponse({ user: createdUser }, "User created successfully", 200));
    }
)


export const loginUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;

        // check for missing fields
        [email, password].some((field) => {
            if (!field) {
                res.status(400);
                throw new ApiError("Missing fields", 301);
            }
        });

        const user = await User.findOne({ email }).select('+password +_id');

        if (!user) {
            throw new ApiError("User does not exist", 303);
        }


        if (!user || !(await user.isPasswordValid(password))) {
            throw new ApiError('Invalid email or password', 401);
        }

        if (!user.emailVerified) {
            throw new ApiError('Email not verified', 401);
        }

        const { accessToken, refreshToken } = await generateAcessAndRefreshTokens(user._id.toString());

        const updatedUser = await User.findById(
            user._id,
        ).select('-password -emailVerified  -refreshToken -verifyToken -verifyTokenExpiry');


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

export const getUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const user = req.user as IUser & Document;

        res.status(200)
            .json(new ApiResponse({ user }, "User fetched successfully", 200));
    }
)

export const sendVerificationEmail = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
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