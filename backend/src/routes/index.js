import express from 'express';
import { Test } from '../models/test.js';
import TarefaController from '../controllers/TarefaController.js';

const router = express.Router();
const tarefaController = new TarefaController();


router.get('/test-db', async (req, res) => {
  try {
    const test = await Test.create({ title: 'Primeira tarefa conectada!' });
    res.json(test);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao testar conexão com o banco' });
  }
});

// Rotas de Tarefas

router.post('/api/tarefas/simples', (req, res) => {
  tarefaController.criarTarefaSimples(req, res);
});

router.post('/api/tarefas/com-prazo', (req, res) => {
  tarefaController.criarTarefaComPrazo(req, res);
});

router.post('/api/tarefas/recorrente', (req, res) => {
  tarefaController.criarTarefaRecorrente(req, res);
});

router.get('/api/tarefas', (req, res) => {
  tarefaController.listarTarefas(req, res);
});

router.get('/api/tarefas/:id', (req, res) => {
  tarefaController.buscarTarefaPorId(req, res);
});

router.put('/api/tarefas/:id', (req, res) => {
  tarefaController.editarTarefa(req, res);
});

router.patch('/api/tarefas/:id/concluir', (req, res) => {
  tarefaController.concluirTarefa(req, res);
});

router.delete('/api/tarefas/:id', (req, res) => {
  tarefaController.removerTarefa(req, res);
});

export default router;
