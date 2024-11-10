import express from "express";
import db_connect from './db/index.js';
import dotenv from 'dotenv';

dotenv.config({
    path: "./env"
});

const app = express();
app.get('/', (req, res) => {
    res.send('Hello World!')
})

const init = async () => {
    try {
        db_connect();
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