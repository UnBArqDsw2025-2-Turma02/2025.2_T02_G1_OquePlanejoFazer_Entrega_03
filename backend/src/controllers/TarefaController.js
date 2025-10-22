import { Tarefa, GerenciadorFabricaTarefas } from '../models/Tarefa.js';
import { TarefaService } from '../services/TarefaService.js';
import { TarefaCommandInvoker } from '../models/commands/TarefaCommandInvoker.js';
import { TarefaCommandFactory } from '../models/commands/TarefaCommandFactory.js';

class TarefaController {
  constructor() {
    this.fabricaTarefas = new GerenciadorFabricaTarefas();
    // Bridge Pattern: TarefaService usa implementação de persistência
    this.tarefaService = new TarefaService();
    this.tarefaCommandInvoker = new TarefaCommandInvoker();
  }

  async criarTarefaSimples(req, res) {
    try {
      const { titulo, descricao, prioridade, estimativa } = req.body;
      
      if (!titulo || !descricao || !estimativa) {
        return res.status(400).json({ 
          error: 'Titulo, descrição e estimativa são obrigatórios' 
        });
      }

      const tarefa = this.fabricaTarefas.criarTarefaSimples(titulo, descricao, prioridade, estimativa);
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
      const { titulo, descricao, prioridade, estimativa, dataVencimento } = req.body;
      
      if (!titulo || !descricao || !estimativa || !dataVencimento) {
        return res.status(400).json({ 
          error: 'Titulo, descrição, estimativa e data de vencimento são obrigatórios' 
        });
      }

      const tarefa = this.fabricaTarefas.criarTarefaComPrazo(
        titulo, 
        descricao, 
        prioridade, 
        estimativa, 
        new Date(dataVencimento)
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
      const { titulo, descricao, prioridade, estimativa, repeticao, dataVencimento } = req.body;
      
      if (!titulo || !descricao || !estimativa || !repeticao) {
        return res.status(400).json({ 
          error: 'Titulo, descrição, estimativa e repetição são obrigatórios' 
        });
      }

      const tarefa = this.fabricaTarefas.criarTarefaRecorrente(
        titulo, 
        descricao, 
        prioridade, 
        estimativa, 
        repeticao,
        dataVencimento ? new Date(dataVencimento) : null
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
      const { tipo, concluida, prioridade } = req.query;
      
      let filtro = {};
      
      if (tipo) filtro.tipo = tipo;
      if (concluida !== undefined) filtro.concluida = concluida === 'true';
      if (prioridade) filtro.prioridade = prioridade;

      const tarefas = await Tarefa.find(filtro).sort({ criadoEm: -1 });
      
      res.json({
        message: 'Tarefas listadas com sucesso',
        tarefas,
        total: tarefas.length
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
      
      const comando = TarefaCommandFactory.criarComandoInteligente(
        id, 
        dadosAtualizacao, 
        this.tarefaService
      );
      
      // Executar comando através do invoker
      const tarefa = await this.tarefaCommandInvoker.executarComando(comando);
      
      res.json({
        message: 'Tarefa editada com sucesso',
        tarefa
      });
    } catch (error) {
      console.error('Erro ao editar tarefa:', error);
      
      if (error.message === 'Tarefa não encontrada') {
        return res.status(404).json({ error: error.message });
      }
      
      if (error.message.includes('não pode estar vazio') || 
          error.message.includes('deve ser') ||
          error.message.includes('inválida')) {
        return res.status(400).json({ error: error.message });
      }
      
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
