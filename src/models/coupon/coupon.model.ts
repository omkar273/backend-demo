import { model, Schema, Document } from "mongoose";

interface ICoupon extends Document {
    title: string;
    couponCode: string;
    expiry: Date;
    maxUsage: number;
    singleUserMaxUsage: number;
    description: string;
    discount: number;
    discountType: 'flat' | 'percentage';
    couponType: "usage" | "expiry";
    thresholdAmount: number;
    terms_and_conditions: string[];
}

const couponSchema = new Schema<ICoupon>(
    {
        title: {
            type: String,
            required: [true, "Coupon title is required"],
        },
        couponCode: {
            type: String,
            required: [true, "Coupon code is required"],
            unique: true,
        },
        expiry: {
            type: Date,
            required: [true, "Expiry date is required"],
        },
        maxUsage: {
            type: Number,
            required: [true, "Max usage count is required"],
        },
        singleUserMaxUsage: {
            type: Number,
            default: 1,
        },
        description: {
            type: String,
            default: "",
        },
        discount: {
            type: Number,
            required: [true, "Discount value is required"],
        },
        discountType: {
            type: String,
            enum: ['flat', 'percentage'],
            default: "flat",
        },
        couponType: {
            type: String,
            enum: ["usage", "expiry"],
            default: 'expiry',
        },
        thresholdAmount: {
            type: Number,
            default: 0,
        },
        terms_and_conditions: {
            type: [String],
            default: [],
        },
    },
    { timestamps: true }
);

const Coupon = model<ICoupon>("Coupon", couponSchema);

export default Coupon;
