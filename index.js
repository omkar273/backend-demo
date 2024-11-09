import express from "express";
import db_connect from './src/db/index.js';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import cors from "cors";



dotenv.config({
    path: "./env"
});

export const app = express();
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    }
));
app.use(express.static('public'));


app.get('/', (req, res) => {
    res.send('Hello World!')
})

const init = async () => {
    try {
        await db_connect();
        app.on('error', (error) => {
            console.log(error);
        })
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`)
        })

    } catch (error) {
        console.log(error);
    }
}

init()