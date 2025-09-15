import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import dotenv from 'dotenv';

import imageService from '../services/image.js';
import { authenticateToken, errorHandler } from '../middleware/index.js';

const imageRouter = express.Router();
dotenv.config();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

imageRouter.use(authenticateToken);

imageRouter.post("/:id/transform", (req, res) => {
    res.status(200).send("Image transformed successfully.");
})


imageRouter.post("/", upload.single('image'), async (req, res) => {
    const file = req.file;
    const metadata = await imageService.upload(file);
    res.status(200).send(metadata);
})


imageRouter.use(errorHandler);

export { imageRouter }