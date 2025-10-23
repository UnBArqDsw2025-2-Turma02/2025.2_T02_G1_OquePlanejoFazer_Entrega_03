// Em um arquivo separado, ex: 'iterators/TarefaIterator.js'
import { Tarefa } from '../../models/Tarefa.js';

class TarefaIterator {
  constructor(filtro, page = 1, limit = 5) {
    this.filtro = filtro;
    this.page = parseInt(page, 10);
    this.limit = parseInt(limit, 10);
    this.total = 0;
  }

  // O método principal que busca a página de dados
  async getCurrentPage() {
    const skip = (this.page - 1) * this.limit;

    // Busca os documentos da página atual
    const tarefas = await Tarefa.find(this.filtro)
      .sort({ criadoEm: -1 })
      .skip(skip)
      .limit(this.limit)
      .populate('categoria');

    // Conta o total de documentos (apenas na primeira página para otimizar)
    if (this.total === 0) {
      this.total = await Tarefa.countDocuments(this.filtro);
    }

    return tarefas;
  }

  // Método para verificar se existe uma próxima página
  hasNext() {
    return (this.page * this.limit) < this.total;
  }

  // Método para obter informações de paginação
  getPaginationInfo() {
    return {
      totalItems: this.total,
      totalPages: Math.ceil(this.total / this.limit),
      currentPage: this.page,
      hasNext: this.hasNext(),
    };
  }
}

export default TarefaIterator;