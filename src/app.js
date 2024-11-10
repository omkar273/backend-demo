import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from './routes/user/user.route.js';

export const app = express();

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',  // Default to '*' for development or specify origins
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// auth/onboarding routes
app.use('/auth', userRouter);