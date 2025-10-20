import { Tarefa } from '../models/Tarefa.js';

export class TarefaService {
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
}
