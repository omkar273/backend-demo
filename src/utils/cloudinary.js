import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: 'caygnus',
    api_key: '329863484115665',
    api_secret: process.env.CLOUDINARY_API_KEY,
});

const uploadFile = async (filePath) => {
    try {
        if (!fs.existsSync(filePath)) {
            throw new Error('File not found');
            return;
        }

        const uploadResult = await cloudinary.uploader
            .upload(
                filePath, {
                resource_type: 'auto',
                // public_id: 'shoes',
            })
        console.log(uploadResult);

        return uploadResult;
    } catch (error) {
        console.log(error);
    } finally {
        fs.unlinkSync(filePath);
    }
}

export default uploadFile;
