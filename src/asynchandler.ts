import { Request, Response, NextFunction } from 'express';

interface AsyncHandler {
    (fn: (req: Request, res: Response, next?: NextFunction) => Promise<void>): (req: Request, res: Response, next?: NextFunction) => Promise<void>;
}

const asyncHandler: AsyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error: any) {
        console.log(error);

        res.status(error.code || 500).json({
            message: error.message || `Internal Server Error`,
            success: false,
        });
    }
};


export default asyncHandler;