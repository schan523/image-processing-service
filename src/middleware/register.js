import express from "express";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, addDoc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase.js';

export const register = async (req, res, next) => {
    const auth = getAuth();

    const username = req.body.username;
    const password = req.body.password;
    
    if (!username || !password) {
        const err = new Error("Missing credientials.");
        err.status = 400;
        return next(err);
    }
    
    const q = query(collection(db, "users"), where("username", "==", username));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
        const err = new Error("An account using this email address already exists.");
        err.status = 400;
        return next(err);
    }

    createUserWithEmailAndPassword(auth, username, password)
    .then((userCredential) => {
        const user = userCredential.user;

    })
    .catch((err) => {
        next(err);
    })

    let userDoc = await addDoc(collection(db, "users"), {
        username: username,
        password: password
    });

    userDoc = await getDoc(userDoc);
    req.userDoc = userDoc.data();
    next();
}