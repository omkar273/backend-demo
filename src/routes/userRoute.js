import { Router } from 'express';

const userRouter = Router();

userRouter.get('/login', (req, res) => {
    res.status(200).json('Login page');
});

export default userRouter;