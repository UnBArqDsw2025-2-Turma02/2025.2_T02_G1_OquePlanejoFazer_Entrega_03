import TarefaService from '../services/TarefaService.js';

const service = new TarefaService();

class TarefaController {
  static async createTarefa(req, res) {
    try {
      const tarefa = await service.criarTarefa(req.body);
      res.status(201).json({ message: 'Tarefa criada com sucesso', tarefa });
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
    }
  }

  static async listarTarefas(req, res) {
    try {
      const { tipo, concluida, prioridade, categoria, page, limit } = req.query;
      let filtro = {};
      if (tipo) filtro.tipo = tipo;
      if (concluida !== undefined) filtro.concluida = concluida === 'true';
      if (prioridade) filtro.prioridade = prioridade;
      if (categoria) filtro.categoria = categoria;
      const result = await service.listarTarefas(filtro, page, limit);
      res.json({ message: 'Tarefas listadas com sucesso', ...result });
    } catch (error) {
      console.error('Erro ao listar tarefas:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async buscarTarefaPorId(req, res) {
    try {
      const { id } = req.params;
      const tarefa = await service.buscarTarefaPorId(id);
      if (!tarefa) {
        return res.status(404).json({ error: 'Tarefa não encontrada' });
      }
      res.json({ message: 'Tarefa encontrada', tarefa });
    } catch (error) {
      console.error('Erro ao buscar tarefa:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async editarTarefa(req, res) {
    try {
      const { id } = req.params;
      const tarefa = await service.editarTarefa(id, req.body);
      if (!tarefa) {
        return res.status(404).json({ error: 'Tarefa não encontrada' });
      }
      res.json({ message: 'Tarefa editada com sucesso', tarefa });
    } catch (error) {
      console.error('Erro ao editar tarefa:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async concluirTarefa(req, res) {
    try {
      const { id } = req.params;
      const tarefa = await service.editarTarefa(id, { concluida: true });
      if (!tarefa) {
        return res.status(404).json({ error: 'Tarefa não encontrada' });
      }
      res.json({ message: 'Tarefa concluída com sucesso', tarefa });
    } catch (error) {
      console.error('Erro ao concluir tarefa:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async removerTarefa(req, res) {
    try {
      const { id } = req.params;
      const tarefaRemovida = await service.removerTarefa(id);
      if (!tarefaRemovida) {
        return res.status(404).json({ error: 'Tarefa não encontrada' });
      }
      res.json({ message: 'Tarefa removida com sucesso', tarefaRemovida });
    } catch (error) {
      console.error('Erro ao remover tarefa:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

export default TarefaController; 