import db_connect from './src/db/index.js';
import dotenv from 'dotenv';
import { app } from './src/app.js';

dotenv.config({ path: './.env' });


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
