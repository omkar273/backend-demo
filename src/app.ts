import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression';
import authRouter from './routes/auth/auth.routes.js';
import { Request, Response } from 'express';

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
    res.send('Express Typescript on Vercel')
})

app.get('/ping', (req: Request, res: Response) => {
    res.send('pong 🏓')
})


// auth routes
app.use('/auth', authRouter);


export default app;