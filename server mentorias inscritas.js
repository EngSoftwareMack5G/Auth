const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Endpoint que seu HTML chama
app.post('/api/mentorias-inscritas', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token não fornecido' });
  }

  try {
    const result = await pool.query(`
      SELECT id, titulo, mentor, descricao
      FROM mentorias_inscritas
      WHERE token = $1
    `, [token]);

    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar mentorias:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.listen(PORT, () => {
    console.log('Servidor rodando em http://localhost:' + PORT);
});