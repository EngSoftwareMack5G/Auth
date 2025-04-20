import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { users }from '../users.js';

import authMiddleware from '../middleware/authMiddleware.js';
import verificationMiddleware from '../middleware/verificationMiddleware.js';

export const router = express.Router();


const SECRET = 'segredo_super_top'; 

router.post('/register', verificationMiddleware, async (req, res) => {
    const { username, password } = req.body;
    const userExists = users.find(u => u.username === username);
    if (userExists) return res.status(400).json({ message: 'Usuário já existe' });

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });

    res.status(201).json({ message: 'Usuário criado com sucesso' });
});

router.post('/login', verificationMiddleware, async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (!user) return res.status(401).json({ message: 'Usuário ou senha incorreta' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Usuário ou senha incorreta' });

    const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
    res.json({ token });
});

router.get('/profile', authMiddleware, (req, res) => {
    res.json({
        message: `Bem-vindo, ${req.user.username}` 
    });
});