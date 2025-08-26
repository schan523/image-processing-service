import express from "express";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

export const register = (req, res, next) => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth)

    const username = req.params.username;
    const password = req.params.password;

    if (!username || !password) {
        const err = new Error("Missing credientials.");
        err.status = 400;
        next(err);
    }
    else {
        createUserWithEmailAndPassword(auth, username, password)
        .then((userCredential) => {
            const user = userCredential.user;
        })
        .catch((err) => {
            // const err = new Error();
            // err.status = error.code;
            // err.message = error.message;
            next(err);
        })
        next();
    }
}