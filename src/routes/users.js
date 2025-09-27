import express from 'express';

import { userSchema } from '../models/userSchema.js';
import { errorHandler } from '../middleware/errorHandler.js';
import UserService from '../services/user.js';

const userRouter = express.Router();

userRouter.post('/register', async (req, res, next) => {
    const { error, value } = userSchema.validate(req.body);
  
    if (error) {
        return next(error);
    }

    const userData = await UserService.register(value.username, value.password);

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