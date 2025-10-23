import express from 'express';
import { Test } from '../models/test.js';
import TarefaController from '../controllers/TarefaController.js';
import CategoriaController from '../controllers/CategoriaController.js';

const router = express.Router();
// const tarefaController = new TarefaController(); // REMOVED: use static methods
const categoriaController = new CategoriaController();


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
  TarefaController.createTarefa(req, res);
});

router.post('/api/tarefas/com-prazo', (req, res) => {
  TarefaController.createTarefa(req, res);
});

router.post('/api/tarefas/recorrente', (req, res) => {
  TarefaController.createTarefa(req, res);
});

router.get('/api/tarefas', (req, res) => {
  TarefaController.listarTarefas(req, res);
});

router.get('/api/tarefas/:id', (req, res) => {
  TarefaController.buscarTarefaPorId(req, res);
});

router.put('/api/tarefas/:id', (req, res) => {
  TarefaController.editarTarefa(req, res);
});

router.patch('/api/tarefas/:id/concluir', (req, res) => {
  TarefaController.concluirTarefa(req, res);
});

router.delete('/api/tarefas/:id', (req, res) => {
  TarefaController.removerTarefa(req, res);
});

// Rotas de Categorias
router.post('/api/categorias', (req, res) => {
  categoriaController.criarCategoria(req, res);
});

router.get('/api/categorias', (req, res) => {
  categoriaController.listarCategorias(req, res);
});

//rota de categorias paginadas
router.get('/api/categorias/paginadas', (req, res) => {
  categoriaController.listarCategoriasPaginadas(req, res);
});

router.put('/api/categorias/:id', (req, res) => {
  categoriaController.editarCategoria(req, res);
});

router.delete('/api/categorias/:id', (req, res) => {
  categoriaController.removerCategoria(req, res);
});

export default router;
