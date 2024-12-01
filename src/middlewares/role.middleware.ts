
import asyncHandler from './../utils/asynchandler.js';
import { Request, Response, NextFunction } from 'express';

const roleMiddleware = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const role = req.body.role || req.headers.role;
        console.log('role :', req.headers.role);
        console.log('got role :', role);
        req.role = role;

        next();
    }
)

export default roleMiddleware;