import { db } from '../loaders/mongo.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const register = async (req, res, next) => {
    
    const username = req.body.username;
    const password = req.body.password;
    
    if (!username || !password) {
        const err = new Error("Missing credientials.");
        err.status = 400;
        return next(err);
    }
    
    const coll = db.collection("users");
    const exists = await coll.findOne({username: {$eq: username}});

    if (exists) {
        const err = new Error("An account using this email address already exists.");
        err.status = 400;
        return next(err);
    }

    const data = {
        "username": username,
        "password": password
    }

    const result = await coll.insertOne(data);
    req.userData = data;
    req.userData.jwt = jwt.sign({ "username": username }, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
    next();
}