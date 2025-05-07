import express from 'express';
import { router as authRoutes } from './routes/auth.js';
import 'dotenv/config';
import cors from 'cors';

const app = express();

// Configure CORS to allow requests from specific origins
app.use(cors({
    origin: '*', // Allow this specific origin
    credentials: true // Allow cookies and credentials if needed
}));


app.use(express.json());
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Serviço rodando na porta ${PORT}`);
});
