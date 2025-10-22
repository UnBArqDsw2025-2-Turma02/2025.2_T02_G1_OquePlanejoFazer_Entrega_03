import { Tarefa, TarefaSimples, TarefaComPrazo, TarefaRecorrente, GerenciadorFabricaTarefas } from '../models/Tarefa.js';
import { PersistenciaMongoDB } from './PersistenciaTarefa.js';

export class TarefaService {
  constructor(persistencia = null) {
    this.fabricaTarefas = new GerenciadorFabricaTarefas();
    this.persistencia = persistencia || new PersistenciaMongoDB(Tarefa, this.fabricaTarefas);
  }

  async buscarTarefaPorId(tarefaId) {
    return await this.persistencia.buscarPorId(tarefaId);
  }

  async editarTarefa(tarefaId, dadosAtualizacao) {
    return await this.persistencia.atualizar(tarefaId, dadosAtualizacao);
  }

  async converterTipoTarefa(tarefaAtual, novoTipo, dadosAtualizacao) {
    return await this.persistencia.converterTipo(tarefaAtual, novoTipo, dadosAtualizacao);
  }

  async listarTarefas() {
    return await this.persistencia.buscarTodos();
  }

  async removerTarefa(tarefaId) {
    return await this.persistencia.deletar(tarefaId);
  }

  async salvarTarefa(tarefa) {
    return await this.persistencia.salvar(tarefa);
  }
}
