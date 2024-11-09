import asyncHandler from './../../utils/asyncHandler.js';

export const registerUser = asyncHandler(async (req, res) => {
    res.json({ message: 'Register User' });
});


