import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';




const uploadFile = async (filePath) => {
    try {
        const api_secret = process.env.CLOUDINARY_API_KEY;

        cloudinary.config({
            cloud_name: 'caygnus',
            api_key: '329863484115665',
            api_secret: api_secret,
        });
        console.log(api_secret);

        if (!fs.existsSync(filePath)) {
            throw new Error('File not found');
        }

        const uploadResult = await cloudinary.uploader
            .upload(
                filePath, {
                resource_type: 'auto',
                // public_id: 'shoes',
            })
        console.log(uploadResult);
        fs.unlinkSync(filePath);
        return uploadResult;
    } catch (error) {
        fs.unlinkSync(filePath);
        console.log(error);
    }
}

export default uploadFile;
