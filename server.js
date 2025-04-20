import express from 'express';
import { router as authRoutes } from './routes/auth.js';
const app = express();

app.use(express.json());
app.use('/auth', authRoutes);

const PORT = 3002;
app.listen(PORT, () => {
    console.log(`Auth service running on port ${PORT}`);
});
