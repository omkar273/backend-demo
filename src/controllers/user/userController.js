import asyncHandler from './../../utils/asyncHandler.js';
import ApiError from './../../utils/api_error.js';
import { User } from './../../models/user.model.js';
import ApiResponse from './../../utils/api_success.js';
import uploadFile from './../../utils/cloudinary.js';

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
    console.log(avatarUrl);


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


