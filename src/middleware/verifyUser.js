import { db } from '../loaders/mongo.js';

export const verifyUser = async (username, password) => {
    const coll = db.collection("users");
    const user = await coll.findOne({username: username});
    if (!user || user.password != password) {
        return;
    }
    return user;
}