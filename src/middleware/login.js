import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { db } from '../loaders/mongo.js';

dotenv.config();

export const login = async (req, res, next) => {

    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        const err = new Error("Missing login credientials.");
        err.status = 400;
        return next(err);
    }

    const coll = db.collection("users");
    const doc = await coll.findOne({username: {$eq: username}});

    if (doc?.password != password) {
        const err = new Error("A user with this username or password does not exist.");
        err.status = 400;
        return next(err);
    }

    req.doc = doc;
    req.doc.jwt = jwt.sign({ "username": username }, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
    next();
}