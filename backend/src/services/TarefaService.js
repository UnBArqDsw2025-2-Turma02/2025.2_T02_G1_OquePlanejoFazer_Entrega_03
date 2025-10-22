import { Tarefa, TarefaSimples, TarefaComPrazo, TarefaRecorrente, GerenciadorFabricaTarefas } from '../models/Tarefa.js';

export class TarefaService {
  constructor() {
    this.fabricaTarefas = new GerenciadorFabricaTarefas();
  }

  async buscarTarefaPorId(tarefaId) {
    const tarefa = await Tarefa.findOne({ id: tarefaId });
    
    if (!tarefa) {
      throw new Error('Tarefa não encontrada');
    }
    
    return tarefa;
  }

  async editarTarefa(tarefaId, dadosAtualizacao) {
    const tarefa = await this.buscarTarefaPorId(tarefaId);
    
    tarefa.editar(dadosAtualizacao);
    
    await tarefa.save();
    
    return tarefa;
  }

  async converterTipoTarefa(tarefaAtual, novoTipo, dadosAtualizacao) {
    const dadosBase = {
      titulo: dadosAtualizacao.titulo || tarefaAtual.titulo,
      descricao: dadosAtualizacao.descricao || tarefaAtual.descricao,
      prioridade: dadosAtualizacao.prioridade || tarefaAtual.prioridade,
      estimativa: dadosAtualizacao.estimativa || tarefaAtual.estimativa,
      concluida: tarefaAtual.concluida,
      criadoEm: tarefaAtual.criadoEm,
      atualizadoEm: new Date()
    };

    let novaTarefa;
    switch (novoTipo) {
      case 'simples':
        novaTarefa = this.fabricaTarefas.criarTarefaSimples(
          dadosBase.titulo,
          dadosBase.descricao,
          dadosBase.prioridade,
          dadosBase.estimativa
        );
        break;
        
      case 'comPrazo':
        if (!dadosAtualizacao.dataVencimento) {
          throw new Error('Data de vencimento é obrigatória para tarefa com prazo');
        }
        novaTarefa = this.fabricaTarefas.criarTarefaComPrazo(
          dadosBase.titulo,
          dadosBase.descricao,
          dadosBase.prioridade,
          dadosBase.estimativa,
          dadosAtualizacao.dataVencimento
        );
        break;
        
      case 'recorrente':
        if (!dadosAtualizacao.repeticao) {
          throw new Error('Repetição é obrigatória para tarefa recorrente');
        }
        novaTarefa = this.fabricaTarefas.criarTarefaRecorrente(
          dadosBase.titulo,
          dadosBase.descricao,
          dadosBase.prioridade,
          dadosBase.estimativa,
          dadosAtualizacao.repeticao,
          dadosAtualizacao.dataVencimento || null
        );
        break;
        
      default:
        throw new Error(`Tipo de tarefa inválido: ${novoTipo}`);
    }

    novaTarefa.id = tarefaAtual.id;
    novaTarefa.criadoEm = dadosBase.criadoEm;
    novaTarefa.concluida = dadosBase.concluida;
    novaTarefa.atualizadoEm = dadosBase.atualizadoEm;

    const session = await Tarefa.startSession();
    
    try {
      await session.withTransaction(async () => {
        await Tarefa.deleteOne({ _id: tarefaAtual._id }).session(session);
        
        await novaTarefa.save({ session });
      });
      
      return novaTarefa;
    } finally {
      await session.endSession();
    }
  }
}
