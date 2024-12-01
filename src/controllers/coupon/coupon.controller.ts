import { NextFunction, Request, Response } from 'express';
import asyncHandler from '../../utils/asynchandler.js';
import Coupon from './../../models/coupon/coupon.model.js';
import validateRequiredFields from './../../utils/validate_fields.js';
import ApiError from './../../utils/api_error.js';
import ApiResponse from './../../utils/api_success.js';

export const createCoupon = asyncHandler(

    async (req: Request, res: Response, next: NextFunction) => {
        const {
            title,
            couponCode,
            expiry,
            maxUsage,
            singleUserMaxUsage = 1,
            description = "",
            discount,
            discountType = 'flat',
            couponType = 'usage',
            thresholdAmount = 0,
            terms_and_conditions = []
        } = req.body;
        const requiredFields = [
            'title', 'couponCode', 'expiry', 'maxUsage',
            'discount', 'discountType', 'couponType'
        ];

        const missingFields = validateRequiredFields(req.body, requiredFields);

        if (missingFields.length > 0) {
            throw new ApiError(`Missing required fields: ${missingFields.join(', ')}`, 400)
        }

        const savedCoupon = await Coupon.create({
            couponCode,
            couponType,
            description,
            discount,
            discountType,
            expiry,
            maxUsage,
            singleUserMaxUsage,
            terms_and_conditions,
            thresholdAmount,
            title
        });

        res.status(201).json(new ApiResponse(savedCoupon, 'Coupon created successfully', 201));
    }


)