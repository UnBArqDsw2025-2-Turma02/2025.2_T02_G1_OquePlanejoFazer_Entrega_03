import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Rota inicial para testar
app.get('/', (req, res) => {
  res.json({ message: 'uhuuu backend rodando 🚀' });
});

export default app;