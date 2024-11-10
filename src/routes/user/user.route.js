import { Router } from 'express';
import { loginUser, logoutUser, refreshAcessToken, registerUser } from '../../controllers/user/userController.js';
import verifyJwt from './../../middleware/auth/auth.middleware.js';
import { upload } from './../../middleware/multer/multer_middleware.js';

const userRouter = Router();

userRouter.post(
    '/register',
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'cover', maxCount: 1 }
    ]),
    registerUser,
);

userRouter.route('/login').post(loginUser);

userRouter.route('/logout').post(verifyJwt, logoutUser);
userRouter.route('/refresh-token').post(refreshAcessToken);

export default userRouter;