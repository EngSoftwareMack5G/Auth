const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const users = require('../users');
const authMiddleware = require('../middleware/authMiddleware');

const SECRET = 'segredo_super_top'; // em produção use uma env var

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const userExists = users.find(u => u.username === username);
  if (userExists) return res.status(400).json({ message: 'Usuário já existe' });

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });

  res.status(201).json({ message: 'Usuário criado com sucesso' });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) return res.status(400).json({ message: 'Usuário não encontrado' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Senha incorreta' });

  const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
  res.json({ token });
});

router.get('/profile', authMiddleware, (req, res) => {
  res.json({ message: `Bem-vindo, ${req.user.username}` });
});

module.exports = router;
