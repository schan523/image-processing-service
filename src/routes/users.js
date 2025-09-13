import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

import { errorHandler } from '../middleware/errorHandler.js';
import { verifyUser } from '../middleware/verifyUser.js';
import { db } from '../loaders/mongo.js';

dotenv.config();
const userRouter = express.Router();

userRouter.post('/register', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        const err = new Error("Missing credientials.");
        err.status = 400;
        return next(err);
    }
    
    const coll = db.collection("users");
    const exists = await coll.findOne({username: username});

    if (exists) {
        const err = new Error("An account using this email address already exists.");
        err.status = 400;
        return next(err);
    }

    const saltRounds = 10;
    req.userData = {username: username};
    bcrypt.hash(password, saltRounds, async (err, hash) => {
        await coll.insertOne({ "username": username, "password": hash});
        req.userData.password = hash;
    })

    req.userData.jwt = jwt.sign({"username": username}, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
    res.status(201).send(req.userData);
})


userRouter.post('/login', verifyUser, (req, res) => {
    const { username, password } = req.body;

    req.user.jwt = jwt.sign({ "username": username, "password": password }, process.env.TOKEN_SECRET, { expiresIn: '1800s' });

    res.status(201).send(req.user);
})

userRouter.use(errorHandler);

export { userRouter }