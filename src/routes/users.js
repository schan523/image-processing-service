import express from 'express';
import { errorHandler } from '../middleware/errorHandler.js';
import { register } from '../middleware/register.js';

const userRouter = express.Router();

userRouter.post('/register', register, (req, res) => {
    res.status(201).send("User registered");
})

userRouter.use(errorHandler);

export { userRouter }