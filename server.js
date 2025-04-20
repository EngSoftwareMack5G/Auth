const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');

app.use(express.json());
app.use('/auth', authRoutes);

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
