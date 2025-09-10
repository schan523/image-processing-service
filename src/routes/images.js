import express from 'express';
import { uploadImage } from '../middleware/uploadImage.js';
import { errorHandler } from '../middleware/errorHandler.js';
import multer from 'multer';

const imageRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

imageRouter.post("/", upload.single('image'), uploadImage, (req, res) => {
    res.status(200).send(req.file);
})

imageRouter.use(errorHandler);

export { imageRouter }