import asyncHandler from './../../utils/asyncHandler';

export const registerUser = asyncHandler(async (req, res) => {
    res.json({ message: 'Register User' });
});


