import { User } from "./../../../models/user/user.model.js";
import ApiError from './../../../utils/api_error.js';

const generateAcessAndRefreshTokens = async (userId: string): Promise<{
    accessToken: string;
    refreshToken: string;
}> => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError('User Not Found', 404);
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError('Something Went Wrong While Generating Token', 500);
    }
}

export default generateAcessAndRefreshTokens;