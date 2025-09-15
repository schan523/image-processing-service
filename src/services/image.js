import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';

import { s3 } from '../loaders/s3.js';

dotenv.config();

export default class ImageService {
    static async upload(file) {
        const command = new PutObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: file.originalname,
            Body: file.buffer,
            ContentType: file.mimetype
        });
        await s3.send(command);

        const urlCommand = new GetObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: file.originalname
        });
        const url = await getSignedUrl(s3, urlCommand, { expiresIn: 1800});

        const { buffer, ...metadata } = file;
        metadata.url = url;

        return metadata;
    }
 }