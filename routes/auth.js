import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
import 'dotenv/config';

import authMiddleware from '../middleware/authMiddleware.js';
import verificationMiddleware from '../middleware/verificationMiddleware.js';

const SECRET = process.env.SECRET;

export const router = express.Router();

const passwordRegex = /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?`~]).{5,}$/
const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

router.post('/register', verificationMiddleware, async (req, res) => {
    const { username, password, type } = req.body;

    const userExists = (await pool.query('SELECT * FROM users WHERE username = $1', [username])).rowCount > 0;

    if (userExists) return res.status(400).json({ message: 'Usuário já existe' });

    if(!emailRegex.test(username)) return res.status(400).json({ message: 'Email inválido' });
    if(!passwordRegex.test(password)) return res.status(400).json({ message: 'Senha deve conter no mínimo 5 dígitos, uma letra maiúscula, um número e um caractere especial' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (username, password, type) VALUES ($1, $2, $3)', [username, hashedPassword, type]);

    res.status(201).json({ message: 'Usuário criado com sucesso' });
});

router.post('/login', verificationMiddleware, async (req, res) => {
    const { username, password } = req.body;

    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user) return res.status(401).json({ message: 'Usuário ou senha incorreta' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Usuário ou senha incorreta' });

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