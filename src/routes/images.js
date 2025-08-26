import express from 'express';
import { errorHandler } from '../middleware/errorHandler.js';

const imageRouter = express.Router();

imageRouter.use(errorHandler);

export { imageRouter }