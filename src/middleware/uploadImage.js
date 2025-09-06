import { getStorage } from 'firebase/storage';

export const upload = (req, res, next) => {
    const storage = getStorage();
    next();
}