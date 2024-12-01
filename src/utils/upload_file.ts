import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import ApiError from './api_error.js';

const uploadFile = async (filePath: string) => {
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
        throw new ApiError('Error in uploading file', 500);
    }
};

export const deleteFile = async (fileUrl: string) => {
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

        const publicId = fileUrl.match(/\/([^\/]+)\.\w+$/)?.[1]

        if (!publicId) {
            throw new Error('Invalid file url');
        }

        const deleteResult = await cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) {
                console.error('Delete error:', error);
            }
            console.log('Delete result:', result);

            return result;
        });

        console.log(deleteResult);

    } catch (error) {
        console.log('Error in deleting a fil Delete error:', error);
        throw new ApiError(`Error in deleting a file of url ${fileUrl}`, 500);
    }
}

export default uploadFile;