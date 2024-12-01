import asyncHandler from '../../utils/asynchandler.js';
import { Request, Response, NextFunction } from 'express';
import validateRequiredFields from './../../utils/validate_fields.js';
import ApiError from './../../utils/api_error.js';
import { User } from '../../models/user/user.model.js';
import Referral from './../../models/referral/referral.model.js';
import ApiResponse from './../../utils/api_success.js';

export const referUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { refferedTo, referralCode, platform } = req.body;

        // Validate required fields
        const missingFields = validateRequiredFields(req.body, ['refferedTo', 'referralCode']);
        if (missingFields.length > 0) {
            throw new ApiError(`Missing Fields: ${missingFields.join(', ')}`, 400)
        }


        // Check if the user has already been referred
        const existingReferral = await Referral.findOne({ referredTo: refferedTo });
        if (existingReferral) {
            throw new ApiError('User has already been referred', 400)
        }

        // Verify if the referral code exists
        const referrerUser = await User.findOne({ referralCode });
        if (!referrerUser) {
            throw new ApiError('Invalid Referral Code', 404)
        }

        // Create a new referral entry
        const referral = await Referral.create({
            referredBy: referrerUser._id,
            referredTo: refferedTo,
            referralCode,
            platform: platform || 'website',
            status: 'pending',
            referralDate: new Date(),
        });

        // Send success response
        res.status(201).json(new ApiResponse(referral, 'Referral added successfully', 201));
    }
);

