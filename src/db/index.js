import mongoose from "mongoose";

const db_connect = async () => {
    try {
        const connection = await mongoose.connect(`${process.env.MOGODB_URI}/${process.env.DB_NAME}`,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        )
        console.log(`Database connected to ${connection.connection.host}`);



        connection.connection.on('error', (error) => {
            console.log(error);
        })
    } catch (error) {
        console.log('mongodb connection failed', error);
        process.exit(1);
    }
}

export default db_connect;