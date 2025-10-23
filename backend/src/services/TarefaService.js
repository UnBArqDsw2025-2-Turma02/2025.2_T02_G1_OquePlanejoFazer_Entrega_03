// Facade para lógica de negócio de tarefas
import TarefaRepository from '../repository/TarefaRepository.js';
import TarefaFactory from '../controllers/factories/TarefaFactory.js';
import TarefaIterator from '../controllers/iterators/TarefaIterator.js';

class TarefaService {
  constructor() {
    this.repository = new TarefaRepository();
  }

  async criarTarefa(dados) {
    const { tipo, ...dadosDaTarefa } = dados;
    const ModeloCorreto = TarefaFactory.getModel(tipo);
    const novaTarefa = new ModeloCorreto(dadosDaTarefa);
    return this.repository.create(novaTarefa);
  }

  async listarTarefas(filtro, page, limit) {
    const iterator = new TarefaIterator(filtro, page, limit);
    const tarefas = await iterator.getCurrentPage();
    const paginationInfo = iterator.getPaginationInfo();
    return { tarefas, pagination: paginationInfo };
  }

  async buscarTarefaPorId(id) {
    return this.repository.findById(id);
  }

  async editarTarefa(id, dadosAtualizacao) {
    return this.repository.update(id, dadosAtualizacao);
  }

  async removerTarefa(id) {
    return this.repository.delete(id);
  }
}

export default TarefaService;
