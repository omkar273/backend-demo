import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';

const uploadFile = async (filePath) => {
    try {
        const api_key = process.env.CLOUDINARY_API_KEY;
        const api_secret = process.env.CLOUDINARY_API_SECRET;

        console.log('api_key', api_key, 'api_secret', api_secret);

        cloudinary.config({
            cloud_name: 'caygnus',
            api_key: api_key,
            api_secret: api_secret,
            timeout: 120000, // 120 seconds, increase if necessary
        });

        if (!fs.existsSync(filePath)) {
            throw new Error('File not found');
        }

        const uploadResult = await cloudinary.uploader.upload(filePath, {
            resource_type: 'auto',
        }, (error, result) => {
            if (error) {
                console.error('Upload error:', error);
            }
            console.log('Upload result:', result);

            return result;
        });

        console.log('upload result', uploadResult);
        await fs.unlinkSync(filePath);
        return uploadResult;
    } catch (error) {
        await fs.unlinkSync(filePath);
        console.log('Upload error:', error);
    }
};


export default uploadFile;