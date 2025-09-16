import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// import { db } from '../loaders/mongo.js';
import db from '../loaders/mongoose.js';
import { userModel } from '../models/user.js';
import mongoose from 'mongoose';    

export default class UserService {
    static async register(username, password) {

        await db();
        let userData = {username: username};
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);
        if (hash) {
            userData.password = hash;
        }

        const user = new userModel({email: username, password: hash});
        await user.save();

        userData.jwt = jwt.sign({"username": username}, process.env.TOKEN_SECRET, { expiresIn: '1800s' });

        return userData;
    }

    static async login(username, password) {
        // const coll = db.collection("users");
        // const user = await coll.findOne({username: username});

        await db();
        let user = await userModel.findOne({ "email": username}).select('-_id -__v');
        user = user.toObject();        const hashedPassword = user?.password;

        if (!user) {
            return;
        }

        const check = bcrypt.compare(password, hashedPassword);

        if (!check) {
            return;
        }

        user.jwt = jwt.sign({ "username": username, "password": password }, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
        console.log(user.jwt);
        console.log(user);
        return user;
    }
}