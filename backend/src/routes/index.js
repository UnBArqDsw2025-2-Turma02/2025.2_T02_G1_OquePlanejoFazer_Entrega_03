import express from 'express';
import { Test } from '../models/test.js';
import TarefaController from '../controllers/TarefaController.js';
import AuthController from '../controllers/AuthController.js';
import authProxy from '../middlewares/AuthProxy.js';

const router = express.Router();
const tarefaController = new TarefaController();

router.post('/api/register', AuthController.register);
router.post('/api/login', AuthController.login);

router.get('/api/me', authProxy, (req, res) => {
  res.json({ message: 'Acesso autorizado pelo Proxy!', userId: req.userId });
});

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

router.post('/api/register', AuthController.register);

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
