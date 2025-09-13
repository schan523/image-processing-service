import { db } from '../loaders/mongo.js';
import bcrypt from 'bcrypt';

export const verifyUser = async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        const err = new Error("Missing login credientials.");
        err.status = 400;
        return next(err);
    }

    const coll = db.collection("users");
    const user = await coll.findOne({username: username});
    const hashedPassword = user?.password;

    if (!user) {
        const err = new Error("A user with this username or password does not exist.");
        err.status = 400;
        return next(err);
    }

    const check = await bcrypt.compare(password, hashedPassword);

    if (!check) {
        const err = new Error("A user with this username or password does not exist.");
        err.status = 400;
        return next(err);
    }
    
    req.user = user;
    next();
}