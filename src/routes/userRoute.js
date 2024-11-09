import { Router } from 'express';
import { registerUser } from './../controllers/user/userController.js';
import { upload } from './../middleware/multer_middleware.js';

const userRouter = Router();

userRouter.post(
    '/register',
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'cover', maxCount: 1 }
    ]),
    registerUser,
);

export default userRouter;