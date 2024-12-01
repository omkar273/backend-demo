import { model, Schema, Types } from "mongoose";

interface IReferral {
    referredBy: Types.ObjectId;             // User who made the referral
    referredTo: Types.ObjectId;       // User who was referred (optional until the referred user signs up)
    referralCode: string;                    // Unique code used for the referral
    platform: 'email' | 'social' | 'website'; // Platform where the referral was made
    status: 'pending' | 'completed' | 'canceled'; // Status of the referral
    rewardGranted: boolean;                  // Whether the reward has been granted to the referrer
    referralDate: Date;                      // Date of referral creation
}

const referralSchema = new Schema<IReferral>({
    referredBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Referred By ID is required'],
        index: true
    },
    referredTo: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Referred TO ID is required'],
        index: true
    },
    referralCode: {
        type: String,
        required: true,
    },
    platform: {
        type: String,
        enum: ['email', 'social', 'website'],
        default: 'website'
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'canceled'],
        default: 'pending',
    },
    rewardGranted: {
        type: Boolean,
        default: false,
    },
    referralDate: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

const Referral = model<IReferral>('Referral', referralSchema);

export default Referral;
