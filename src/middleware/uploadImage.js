
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
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

    const urlCommand = new GetObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: req.file.originalname
    });
    req.url = await getSignedUrl(s3, urlCommand, { expiresIn: 1800});
    next();
}