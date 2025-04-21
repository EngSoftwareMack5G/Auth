import jwt from 'jsonwebtoken';
import { SECRET } from '../secret.js';

export default function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];


    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}
