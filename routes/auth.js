import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { DB } from '../db.js';
import 'dotenv/config';

import authMiddleware from '../middleware/authMiddleware.js';
import verificationMiddleware from '../middleware/verificationMiddleware.js';

const SECRET = process.env.SECRET;

export const router = express.Router();

const passwordRegex = /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?`~]).{5,}$/
const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

router.post('/register', verificationMiddleware, async (req, res) => {
    const { username, password, type } = req.body;

    const userExists = await DB.userExists(username);

    if (userExists) return res.status(400).json({ message: 'Usuário já existe' });

    if(!emailRegex.test(username)) return res.status(400).json({ message: 'Email inválido' });
    if(!passwordRegex.test(password)) return res.status(400).json({ message: 'Senha deve conter no mínimo 5 dígitos, uma letra maiúscula, um número e um caractere especial' });

    await DB.registerUser(username, password, type);

    res.status(201).json({ message: 'Usuário criado com sucesso' });
});

router.post('/login', verificationMiddleware, async (req, res) => {
    const { username, password, type } = req.body;

    const user = await DB.getUser(username);
    if (!user) return res.status(401).json({ message: 'Usuário ou senha incorreta' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Usuário ou senha incorreta' });

    if (user.type !== type) return res.status(401).json({ message: 'Tipo de usuário incorreto' });

    const token = jwt.sign({ username: user.username, type: user.type }, SECRET, { expiresIn: '1h' });
    res.json({ token });
});

router.get('/key', authMiddleware, (req, res) => {
    res.json({
        username: req.user.username,
        type: req.user.type,
        expiresIn: req.user.exp 
    });
});

router.delete('/delete', () => {}, async (req, res) => {
    const { username, password } = req.body;

    const isDeleted = await DB.deleteUser(username, password);
    if (!isDeleted) return res.status(401).json({ message: 'Usuário ou senha incorreta', isDeleted: false});

    res.json({ message: 'Usuário deletado com sucesso', isDeleted: true });
})