import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    password: String
});

export const userModel = mongoose.model("users", UserSchema)


