import app from './app.js';
import dotenv from 'dotenv';
import connectMongodb from './db/index.js';

import 'dotenv/config';

dotenv.config({
    path: './env'
});


const init = async () => {
    try {

        await connectMongodb();

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

init();