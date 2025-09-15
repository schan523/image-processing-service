import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { db } from '../loaders/mongo.js';

export default class UserService {
    static async register(username, password) {
        const coll = db.collection("users");
        const exists = await coll.findOne({username: username});

        if (exists) {
            return;
        }

        let userData = {username: username};
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);
        if (hash) {
            userData.password = hash;
            await coll.insertOne(userData);
        }

    userData.jwt = jwt.sign({"username": username}, process.env.TOKEN_SECRET, { expiresIn: '1800s' });

    return userData;
    }

    static async login(username, password) {
        const coll = db.collection("users");
        const user = await coll.findOne({username: username});
        const hashedPassword = user?.password;

        if (!user) {
            return;
        }

        const check = await bcrypt.compare(password, hashedPassword);

        if (!check) {
            return;
        }

        user.jwt = jwt.sign({ "username": username, "password": password }, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
        return user;
    }
}