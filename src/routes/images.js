import express from 'express';
import multer from 'multer';
import joi from 'joi';
import dotenv from 'dotenv';

import imageService from '../services/image.js';
import { transformSchema } from '../models/transformSchema.js';
import { authenticateToken, errorHandler } from '../middleware/index.js';

const imageRouter = express.Router();
dotenv.config();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

imageRouter.use(authenticateToken);

imageRouter.post("/:id/transform", async (req, res) => {
    const user = req.user;
    const transformations = req.body.transformations;
    const { error, value } = transformSchema.validate(transformations)

    if (error) {
        return next(error);
    }
    
    const id = req.params.id;
    const metadata = await imageService.transform(user, id, value);
    res.status(200).send(metadata);
})


imageRouter.get("/:id", async (req, res) => {
    const user = req.user;
    const id = req.params.id;
    const metadata = await imageService.retrieve(user, id);
    res.status(200).send(metadata);
})


imageRouter.post("/", upload.single('image'), async (req, res) => {
    const file = req.file;
    const username = req.user;
    const metadata = await imageService.upload(username, file);
    res.status(200).send(metadata);
})


imageRouter.get("/", async (req, res) => {
    const page = req.query.page;
    const limit = req.query.limit;
    const user = req.user;

    const results = await imageService.paginate(user, page, limit);
    if (!results) {
        res.status(400).send("There are not enough results to return a list with the requested parameters.");
    }

    res.status(200).send(results);
})


imageRouter.use(errorHandler);

export { imageRouter }