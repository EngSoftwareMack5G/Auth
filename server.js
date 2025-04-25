import express from 'express';
import { router as authRoutes } from './routes/auth.js';
import 'dotenv/config';

const app = express();

app.use(express.json());
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Serviço rodando na porta ${PORT}`);
});
