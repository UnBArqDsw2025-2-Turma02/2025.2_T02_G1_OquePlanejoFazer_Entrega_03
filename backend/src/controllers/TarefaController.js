import { Tarefa, GerenciadorFabricaTarefas } from '../models/Tarefa.js';
import TarefaIterator from './iterators/TarefaIterator.js';

class TarefaController {
  constructor() {
    this.fabricaTarefas = new GerenciadorFabricaTarefas();
  }

  async criarTarefaSimples(req, res) {
    try {
      const { titulo, descricao, prioridade, estimativa, categoria } = req.body;
      
      if (!titulo || !descricao || !estimativa || !categoria) {
        return res.status(400).json({ 
          error: 'Titulo, descrição, estimativa e categoria são obrigatórios' 
        });
      }

      const tarefa = this.fabricaTarefas.criarTarefaSimples(titulo, descricao, prioridade, estimativa, categoria);
      await tarefa.save();
      
      res.status(201).json({
        message: 'Tarefa simples criada com sucesso',
        tarefa
      });
    } catch (error) {
      console.error('Erro ao criar tarefa simples:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async criarTarefaComPrazo(req, res) {
    try {
      const { titulo, descricao, prioridade, estimativa, dataVencimento, categoria } = req.body;
      
      if (!titulo || !descricao || !estimativa || !dataVencimento || !categoria) {
        return res.status(400).json({ 
          error: 'Titulo, descrição, estimativa, data de vencimento e categoria são obrigatórios' 
        });
      }

      const tarefa = this.fabricaTarefas.criarTarefaComPrazo(
        titulo, 
        descricao, 
        prioridade, 
        estimativa, 
        new Date(dataVencimento),
        categoria
      );
      await tarefa.save();
      
      res.status(201).json({
        message: 'Tarefa com prazo criada com sucesso',
        tarefa
      });
    } catch (error) {
      console.error('Erro ao criar tarefa com prazo:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async criarTarefaRecorrente(req, res) {
    try {
      const { titulo, descricao, prioridade, estimativa, repeticao, dataVencimento, categoria } = req.body;
      
      if (!titulo || !descricao || !estimativa || !repeticao || !categoria) {
        return res.status(400).json({ 
          error: 'Titulo, descrição, estimativa, repetição e categoria são obrigatórios' 
        });
      }

      const tarefa = this.fabricaTarefas.criarTarefaRecorrente(
        titulo, 
        descricao, 
        prioridade, 
        estimativa, 
        repeticao,
        dataVencimento ? new Date(dataVencimento) : null,
        categoria
      );
      await tarefa.save();
      
      res.status(201).json({
        message: 'Tarefa recorrente criada com sucesso',
        tarefa
      });
    } catch (error) {
      console.error('Erro ao criar tarefa recorrente:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async listarTarefas(req, res) {
    try {
      // 1. Coleta dos filtros e parâmetros de paginação
      const { tipo, concluida, prioridade, categoria, page, limit } = req.query;

      let filtro = {};
      if (tipo) filtro.tipo = tipo;
      if (concluida !== undefined) filtro.concluida = concluida === 'true';
      if (prioridade) filtro.prioridade = prioridade;
      if (categoria) filtro.categoria = categoria;

      // 2. Instancia o Iterator com o filtro e a paginação
      const iterator = new TarefaIterator(filtro, page, limit);

      // 3. Usa o iterator para buscar a página atual de tarefas
      const tarefas = await iterator.getCurrentPage();
      const paginationInfo = iterator.getPaginationInfo();

      // 4. Retorna a resposta paginada
      res.json({
        message: 'Tarefas listadas com sucesso',
        tarefas,
        pagination: paginationInfo
      });

    } catch (error) {
      console.error('Erro ao listar tarefas:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async buscarTarefaPorId(req, res) {
    try {
      const { id } = req.params;
      
      const tarefa = await Tarefa.findOne({ id });
      
      if (!tarefa) {
        return res.status(404).json({ error: 'Tarefa não encontrada' });
      }
      
      res.json({
        message: 'Tarefa encontrada',
        tarefa
      });
    } catch (error) {
      console.error('Erro ao buscar tarefa:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async editarTarefa(req, res) {
    try {
      const { id } = req.params;
      const dadosAtualizacao = req.body;
      
      const tarefa = await Tarefa.findOne({ id });
      
      if (!tarefa) {
        return res.status(404).json({ error: 'Tarefa não encontrada' });
      }
      
      tarefa.editar(dadosAtualizacao);
      await tarefa.save();
      
      res.json({
        message: 'Tarefa editada com sucesso',
        tarefa
      });
    } catch (error) {
      console.error('Erro ao editar tarefa:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async concluirTarefa(req, res) {
    try {
      const { id } = req.params;
      
      const tarefa = await Tarefa.findOne({ id });
      
      if (!tarefa) {
        return res.status(404).json({ error: 'Tarefa não encontrada' });
      }
      
      const mensagem = tarefa.concluir();
      await tarefa.save();
      
      res.json({
        message: mensagem,
        tarefa
      });
    } catch (error) {
      console.error('Erro ao concluir tarefa:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async removerTarefa(req, res) {
    try {
      const { id } = req.params;
      
      const tarefa = await Tarefa.findOne({ id });
      
      if (!tarefa) {
        return res.status(404).json({ error: 'Tarefa não encontrada' });
      }
      
      const mensagem = tarefa.remover();
      await Tarefa.deleteOne({ id });
      
      res.json({
        message: mensagem,
        tarefaRemovida: tarefa
      });
    } catch (error) {
      console.error('Erro ao remover tarefa:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

}

export default TarefaController;
