import express from 'express';
import { uploadImage } from '../middleware/uploadImage.js';
import { transformImage } from '../middleware/transformImage.js';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { errorHandler } from '../middleware/errorHandler.js';
import multer from 'multer';

const imageRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// imageRouter.use(authenticateToken);

imageRouter.post("/:id/transform", authenticateToken, transformImage, (req, res) => {
    res.status(200).send("Image transformed successfully.");
})

imageRouter.post("/", authenticateToken, upload.single('image'), uploadImage, (req, res) => {
    res.status(200).send(req.file);
})


imageRouter.use(errorHandler);

export { imageRouter }