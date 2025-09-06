import express from 'express';
import { upload } from '../middleware/uploadImage.js';
import { errorHandler } from '../middleware/errorHandler.js';

const imageRouter = express.Router();

imageRouter.post("/images", upload, (req, res) => {
    res.status(200).send("Image uploaded.");
})

imageRouter.use(errorHandler);

export { imageRouter }