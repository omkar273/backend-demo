import asyncHandler from './../../utils/asyncHandler.js';
import ApiError from './../../utils/api_error.js';
import { User } from './../../models/user.model.js';
import ApiResponse from './../../utils/api_success.js';
import uploadFile from './../../utils/cloudinary.js';
import jwt from 'jsonwebtoken';


const generateAcessAndRefreshTokens = async (userId) => {
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

export const registerUser = asyncHandler(async (req, res) => {
    const { email, password, fullname, avtar, role } = req.body;
    console.log(email, password, fullname, avtar, role);

    // check if any of the fields is empty
    [email, password, fullname].some((field) => {
        if (field?.trim() === '') {
            res.status(400);
            throw new ApiError('Please fill all the fields', 301);
        }
    });


    // check if the same useraccount already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError('User already exists', 409);
    }

    const avatarPath = req?.files?.avatar[0]?.path;
    const avatarUrl = await uploadFile(avatarPath);
    console.log(avatarUrl, avatarPath);



    const user = await User.create({
        email,
        password,
        fullname,
        role,
        avatarUrl: avatarUrl?.url || null,
    });

    const createdUser = await User.findById(
        user._id,
    ).select('-password -emailVerified  -refreshToken -verifyToken -verifyTokenExpires');

    if (!createdUser) {
        throw new ApiError('Something Went While User Registration', 500);
    }

    res.status(201).json(new ApiResponse(createdUser, 'User Created Successfully', 200));
});

export const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        console.log(email, password);

        throw new ApiError('Please provide email and password', 400);
    }

    const user = await User.findOne({ email }).select('+password +_id');

    if (!user || !(await user.isPasswordValid(password))) {
        throw new ApiError('Invalid email or password', 401);
    }

    const updatedUser = await User.findById(
        user._id,
    ).select('-password -emailVerified  -refreshToken -verifyToken -verifyTokenExpires');


    const { accessToken, refreshToken } = await generateAcessAndRefreshTokens(user._id);

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        // expires: new Date(Date.now() + * 24 * 60 * 60 * 1000),
    };

    res.status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(new ApiResponse(
            {
                user: updatedUser,
                accessToken,
                refreshToken
            }
            , 'User Logged In Successfully', 200,
        ));

});

export const logoutUser = asyncHandler(async (req, res) => {
    const user = req.user;

    const updatedUser = await User
        .findByIdAndUpdate(user._id, {
            "$set": {
                refreshToken: null
            }
        }, {
            new: true
        })
    res
        .clearCookie('accessToken')
        .clearCookie('refreshToken')
        .status(200)
        .json(new ApiResponse({}, 'User Logged Out Successfully', 200));
});


export const refreshAcessToken = asyncHandler(async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
        console.log(refreshToken);

        if (!refreshToken) {
            throw new ApiError('Please provide refresh token', 400);
        }

        const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodedToken.id).select('+refreshToken');

        if (!user) {
            throw new ApiError('Invalid refresh token', 401);
        }

        if (user?.refreshToken !== refreshToken) {
            throw new ApiError('Invalid refresh token', 401);
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateAcessAndRefreshTokens(user._id);

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            // expires: new Date(Date.now() + * 24 * 60 * 60 * 1000),
        };

        res.status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", newRefreshToken, cookieOptions)
            .json(new ApiResponse(
                {
                    accessToken,
                    refreshToken: newRefreshToken
                }
                , 'Acess token successfully', 200,
            ));
    } catch (error) {
        throw new ApiError('Invalid refresh token', 401);
    }

})