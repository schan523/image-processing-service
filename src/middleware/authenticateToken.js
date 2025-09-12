import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        console.log(authHeader);
        const err = new Error("Invalid or missing authorization credientials");
        err.status = 401;
        return next(err);
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) {
            const err = new Error("Invalid token.");
            return next(err);
        }

        req.user = decoded;
        console.log(req.user);
    })
    next();
}