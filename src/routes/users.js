import express from 'express';
import { errorHandler } from '../middleware/errorHandler.js';
import { register } from '../middleware/register.js';
import { login } from '../middleware/login.js'; 

const userRouter = express.Router();

userRouter.post('/register', register, (req, res) => {
    res.status(201).send(req.userDoc);
})

userRouter.post('/login', login, (req, res) => {
    res.status(201).send(req.doc);
})

userRouter.use(errorHandler);

export { userRouter }