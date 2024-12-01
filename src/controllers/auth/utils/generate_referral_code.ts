import { randomBytes } from 'crypto';
import { User } from '../../../models/user/user.model.js';



const generateReferralCode = async (length: number = 6, maxRetries: number = 10): Promise<string> => {
    let referralCode = "";
    let retries = 0;

    // Keep generating a new referralCode until it's unique or maxRetries is reached
    while (retries < maxRetries) {
        const randomValue = randomBytes(Math.ceil(length / 2)).toString('hex');  // Generate a hex string with the desired length
        referralCode = randomValue.toUpperCase();

        // Check if the generated code already exists
        const existingUser = await User.findOne({ referralCode });

        // If it's unique, break the loop
        if (!existingUser) {
            return referralCode;
        }

        retries++;
    }

    // If we exceed the maxRetries, throw an error or handle accordingly
    throw new Error('Failed to generate a unique referral code after maximum retries');
};


export default generateReferralCode;