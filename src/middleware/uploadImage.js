
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '../loaders/s3.js';
import dotenv from 'dotenv';

dotenv.config();

export const uploadImage = async (req, res, next) => {
    console.log(req.user);

    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: req.file.originalname,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
    }
    const command = new PutObjectCommand(params);
    await s3.send(command);
    next();
}