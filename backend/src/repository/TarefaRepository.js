// TarefaRepository.js
// Responsável por todas as operações diretas com o banco de dados para tarefas
import { Tarefa, TarefaSimples, TarefaComPrazo, TarefaRecorrente } from '../models/Tarefa.js';

class TarefaRepository {
  async create(tarefa) {
    return tarefa.save();
  }

  async findById(id) {
    return Tarefa.findById(id).populate('categoria');
  }

  async find(filter = {}, page = 1, limit = 10) {
    return Tarefa.find(filter)
      .populate('categoria')
      .skip((page - 1) * limit)
      .limit(limit);
  }

  async update(id, updateData) {
    return Tarefa.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id) {
    return Tarefa.findByIdAndDelete(id);
  }
}

export default TarefaRepository;
