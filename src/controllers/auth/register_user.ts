import asyncHandler from './../../utils/asynchandler.js';
import { Request, Response, NextFunction } from 'express';
import ApiError from './../../utils/api_error.js';
import { IUser, User } from './../../models/user/user.model.js';
import Referral from './../../models/referral/referral.model.js';
import sendEmail from './../../utils/send_email.js';
import ApiResponse from './../../utils/api_success.js';
import validateRequiredFields from './../../utils/validate_fields';
import CryptoJS from 'crypto-js';
import saveUserDetails from './utils/save_user_details.js';
import generateReferralCode from './utils/generate_referral_code.js';

export const registerUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {

        const { email, password, fullname, phone, avatarUrl, referralCode } = req.body;


        const role: any = req.role;
        req.body.role = role;
        if (!role) {
            throw new ApiError('Role is required', 400);
        }

        const missingFields = validateRequiredFields(req.body, ['email', 'fullname', 'role', 'phone']);

        // const userMissingFields = handleRoleSpecificFields(req.body);

        if (missingFields.length) {
            throw new ApiError(`Missing fields: ${missingFields.join(', ')}`, 400);
        }

        // Check for existing user
        const existingUser = await User.findOne({
            $or: [
                { email: email },
                { phone: phone }
            ],
        });

        if (existingUser && existingUser.roles.includes(role)) {
            throw new ApiError("User with same email or phone number already exists", 302);
        }

        const verifyToken = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
        const verifyTokenExpiry = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

        const uniqueCode = await generateReferralCode();

        const user = existingUser ?? await User.create({
            email,
            password: password || email,
            fullname,
            phone,
            avatarUrl: avatarUrl || undefined,
            referralCode: uniqueCode,
            // verifyToken,
            // verifyTokenExpiry,
            role: [role],
        });

        console.log('saved user :', user);

        user.roles.push(role);
        await user.save();

        await saveUserDetails({
            data: req.body,
            verifyToken,
            verifyTokenExpiry,
            role,
        });


        if (referralCode) {

            const referrerUser = await User.findOne({ referralCode });
            if (!referrerUser) {
                throw new ApiError('Invalid Referral Code', 404);
            }

            const existingReferral = await Referral.findOne({
                referredBy: referrerUser._id,
                referredTo: user._id,
            });
            if (existingReferral) {
                throw new ApiError('Referral already exists for this user', 400);
            }

            const referral = await Referral.create({
                referredBy: referrerUser._id,
                referredTo: user._id,
                referralCode,
                platform: 'website',
                status: 'pending',
                referralDate: new Date(),
            });

            if (!referral) {
                throw new ApiError('Some error occurred while creating referral', 500);
            }

            await referral.save();
        }

        const createdUser = await User.findById(user._id).select("-password");

        if (!createdUser) {
            throw new ApiError("Some error occurred while creating the user", 404);
        }

        const frontend_url = process.env.FRONTEND_URL;
        const verificationUrl = `${frontend_url}/auth/verify-email?token=${verifyToken}`;

        await sendEmail({
            email: user.email,
            subject: `Verification for ${user.fullname}`,
            html: `<a href="${verificationUrl}">Verify your account</a>`,
        });

        res.status(200).json(new ApiResponse({ user: createdUser }, "User created successfully", 200));
    }
);
