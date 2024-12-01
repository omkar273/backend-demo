import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression';
import { Request, Response } from 'express';
import authRouter from './routes/auth/auth.routes.js';
import couponRouter from './routes/coupon/coupon.routes.js';
import userRouter from './routes/user/user.routes.js';
import roleMiddleware from './middlewares/role.middleware.js';

const app = express();

app.use(express.json());


app.use(compression());

app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.use(cookieParser());

app.use(cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));


app.get('/', (req: Request, res: Response) => {
    res.sendFile('/public/index.html');
})

app.get('/ping', (req: Request, res: Response) => {
    res.send('pong 🏓')
})

app.use(roleMiddleware);


// auth routes
app.use('/auth', authRouter);

app.use('/coupon', couponRouter);

app.use('/user', userRouter);

export default app;