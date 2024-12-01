import mongoose from 'mongoose';

const connectMongodb = async () => {
    try {
        const mongo_uri = process.env.MOGODB_URI;
        console.log('mongodb uri', mongo_uri);

        const connection = await mongoose.connect(`${mongo_uri}/${process.env.DB_NAME}`)

        console.log(`MongoDB connected: ${connection.connection.host}`);

        connection.connection.on('error', (error) => {
            console.log(error);
        })

    } catch (error) {
        console.log(error);
    }
}

export default connectMongodb;