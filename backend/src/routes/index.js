import express from 'express';
import { Test } from '../models/test.js';

const router = express.Router();

router.get('/test-db', async (req, res) => {
  try {
    const test = await Test.create({ title: 'Primeira tarefa conectada!' });
    res.json(test);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao testar conexão com o banco' });
  }
});

export default router;
