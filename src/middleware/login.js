import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { db } from '../firebase.js';

dotenv.config();

export const login = async (req, res, next) => {

    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        const err = new Error("Missing login credientials.");
        err.status = 400;
        return next(err);
    }

    const q = query(collection(db, "users"), where("username", "==", username), limit(1));
    const snapshot = await getDocs(q);
    let doc_;
    snapshot.forEach((doc) => {
        doc_ = doc.data(); 
    }) 

    if (snapshot.empty || doc_["password"] != password) {
        const err = new Error("A user with this username or password does not exist.");
        err.status = 400;
        return next(err);
    }

    const auth = getAuth();
    signInWithEmailAndPassword(auth, username, password)
    .then((userCrediential) => {
        const user = userCrediential.user;
    })
    .catch((err) => {
        next(err);
    })

    req.doc = doc_;
    req.doc.jwt = jwt.sign({ "username": username }, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
    next();
}