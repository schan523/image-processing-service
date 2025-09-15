import express from 'express';
import dotenv from 'dotenv';

import { errorHandler } from '../middleware/errorHandler.js';
import UserService from '../services/user.js';

dotenv.config();
const userRouter = express.Router();

userRouter.post('/register', async (req, res, next) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        const err = new Error("Missing credientials.");
        err.status = 400;
        return next(err);
    }

    const userData = await UserService.register(username, password);

    if (!userData) {
        const err = new Error("An account using this email address already exists.");
        err.status = 400;
        return next(err);
    }

    res.status(201).send(userData);
})


userRouter.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await UserService.login(username, password);
    res.status(201).send(user);
})

userRouter.use(errorHandler);

export { userRouter }