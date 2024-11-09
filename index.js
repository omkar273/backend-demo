import express from "express";
import db_connect from './src/db/index.js';
import cookieParser from "cookie-parser";
import cors from "cors";
// import 'dotenv/config';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

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

const init = async () => {
    try {
        await db_connect();
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });

        process.on('unhandledRejection', (error) => {
            console.error('Unhandled promise rejection:', error);
        });

    } catch (error) {
        console.error('Server initialization error:', error);
    }
};

init();
