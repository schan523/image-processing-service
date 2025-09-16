import mongoose from 'mongoose';
import dotenv from 'dotenv';

import { db } from './mongo.js';

dotenv.config();

export default async () => {
    try {
        const connection = await mongoose.connect(process.env.ATLAS_URL, {
            autoIndex: true
        });
    }
    catch (error) {
        console.error(error);
    }
}