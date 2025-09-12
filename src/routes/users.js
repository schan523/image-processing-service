import express from 'express';
import { errorHandler } from '../middleware/errorHandler.js';
import { register } from '../middleware/register.js';
import { login } from '../middleware/login.js'; 

const userRouter = express.Router();

userRouter.post('/register', register, (req, res) => {
    res.status(201).send(req.userData);
})

userRouter.post('/login', login, (req, res) => {
    res.status(201).send(req.user);
})

userRouter.use(errorHandler);

export { userRouter }