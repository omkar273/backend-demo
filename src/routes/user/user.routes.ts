import { Router } from 'express';
import { referUser } from './../../controllers/user/user.controller.js';


const userRouter = Router()

userRouter.route('/refer/').post(referUser)

export default userRouter;