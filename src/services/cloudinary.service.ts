import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//upload an image
const uploadImage = async (localFilePath: string) => {
  try {
    if (!localFilePath) return;
    const uploadedImage = await cloudinary.uploader.upload(localFilePath, {
      folder: 'task-management',
      use_filename: true,
    });
    console.log('File uploaded successfully');
    return uploadedImage;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    console.log('Error uploading file', error);
  }
};

export { uploadImage };
