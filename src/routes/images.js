import express from 'express';
import multer from 'multer';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import sharp from 'sharp';
import dotenv from 'dotenv';

import { authenticateToken, errorHandler } from '../middleware/index.js';
import { s3 } from '../loaders/s3.js';

const imageRouter = express.Router();
dotenv.config();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

imageRouter.use(authenticateToken);

imageRouter.post("/:id/transform", (req, res) => {
    res.status(200).send("Image transformed successfully.");
})


imageRouter.post("/", upload.single('image'), async (req, res) => {

    const command = new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: req.file.originalname,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
    });
    await s3.send(command);

    const urlCommand = new GetObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: req.file.originalname
    });
    req.url = await getSignedUrl(s3, urlCommand, { expiresIn: 1800});

    const { buffer, ...metadata } = req.file;
    metadata.url = req.url;
    res.status(200).send(metadata);
})


imageRouter.use(errorHandler);

export { imageRouter }