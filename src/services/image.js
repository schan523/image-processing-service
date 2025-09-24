import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';
import sharp from 'sharp';
import crypto from 'crypto';

import { s3 } from '../loaders/s3.js';
import db from '../loaders/mongoose.js';
import { userModel } from '../models/user.js';

dotenv.config();

export default class ImageService {

    static async upload(user, file) {
        const key = crypto.randomBytes(16).toString('hex');
        const command = new PutObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype
        });
        await s3.send(command);

        const urlCommand = new GetObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: key
        });
        const url = await getSignedUrl(s3, urlCommand, { expiresIn: 1800});

        const { buffer, ...metadata } = file;
        metadata.url = url;

        await db();
        const userDb = await userModel.findOne({email: user.username});
        userDb.images.push(key);
        await userDb.save();    

        return metadata;
    }

    static async transform(transformations) {
        Object.keys(transformations).forEach(async (key) => {
            const value = transformations[key];
            if (key == "resize") {
                const buffer = await sharp().resize({...value, ...{"fit": "contain"}}).toBuffer();
            }             
        })
    }

    static async retrieve(user, id) {
        await db();
        const dbUser = await userModel.findOne({email: user.username});
        const key = dbUser.images[id];
        console.log(id);

        const command = new GetObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: key
        });
        const url = await getSignedUrl(s3, command, { expiresIn: 1800});

        return { url: url };
    }

    static async paginate(user, page, limit) {
        await db();
        const dbUser = await userModel.findOne({email: user.username});
        let results = [];

        const pageStart = (page - 1) * limit;
        if (dbUser.images.length < pageStart) {
            return;
        }

        for (let i = pageStart; i < page*limit; i++) {
            if (dbUser.images[i]) {
                let imageName = dbUser.images[i];
                let command = new GetObjectCommand({
                    Bucket: process.env.BUCKET_NAME,
                    Key: dbUser.images[i]
                });
                let url = await getSignedUrl(s3, command, {expiresIn: 1800});
                results.push({ filename: imageName, url: url } );
            }
            else {
                break;
            }
        }

        return results;
    }
 }