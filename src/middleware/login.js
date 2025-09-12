import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { db } from '../loaders/mongo.js';
import { verifyUser } from './verifyUser.js';

dotenv.config();

export const login = async (req, res, next) => {

    const { username, password } = req.body;

    if (!username || !password) {
        const err = new Error("Missing login credientials.");
        err.status = 400;
        return next(err);
    }

    const user = await verifyUser(username, password);
    if (!user) {
        const err = new Error("A user with this username or password does not exist.");
        err.status = 400;
        return next(err);
    }

    req.user = user;
    req.user.jwt = jwt.sign({ "username": username, "password": password }, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
    next();
}