import mongoose from 'mongoose';

const User = new mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    password: String
});