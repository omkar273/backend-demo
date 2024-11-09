const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        res.status(error.code || 500).json({
            message: 'Internal Server Error',
            success: false,
        })
    }
}

export default asyncHandler;