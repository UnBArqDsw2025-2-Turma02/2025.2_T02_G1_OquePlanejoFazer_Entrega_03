export class PersistenciaTarefa {
  async salvar(tarefa) {
    throw new Error('Método salvar deve ser implementado');
  }
  
  async buscarPorId(id) {
    throw new Error('Método buscarPorId deve ser implementado');
  }
  
  async buscarTodos() {
    throw new Error('Método buscarTodos deve ser implementado');
  }
  
  async atualizar(id, dados) {
    throw new Error('Método atualizar deve ser implementado');
  }
  
  async deletar(id) {
    throw new Error('Método deletar deve ser implementado');
  }
  
  async converterTipo(tarefaAtual, novoTipo, dadosAtualizacao) {
    throw new Error('Método converterTipo deve ser implementado');
  }
}

export class PersistenciaMongoDB extends PersistenciaTarefa {
  constructor(modeloTarefa, fabricaTarefas) {
    super();
    this.modelo = modeloTarefa;
    this.fabricaTarefas = fabricaTarefas;
  }
  
  async salvar(tarefa) {
    return await tarefa.save();
  }
  
  async buscarPorId(id) {
    const tarefa = await this.modelo.findOne({ id: id });
    if (!tarefa) {
      throw new Error('Tarefa não encontrada');
    }
    return tarefa;
  }
  
  async buscarTodos() {
    return await this.modelo.find({});
  }
  
  async atualizar(id, dados) {
    const tarefa = await this.buscarPorId(id);
    tarefa.editar(dados);
    return await tarefa.save();
  }
  
  async deletar(id) {
    const resultado = await this.modelo.deleteOne({ id: id });
    if (resultado.deletedCount === 0) {
      throw new Error('Tarefa não encontrada');
    }
    return true;
  }
  
  async converterTipo(tarefaAtual, novoTipo, dadosAtualizacao) {
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
          dadosBase.titulo, dadosBase.descricao, dadosBase.prioridade, dadosBase.estimativa
        );
        break;
      case 'comPrazo':
        if (!dadosAtualizacao.dataVencimento) {
          throw new Error('Data de vencimento é obrigatória para tarefa com prazo');
        }
        novaTarefa = this.fabricaTarefas.criarTarefaComPrazo(
          dadosBase.titulo, dadosBase.descricao, dadosBase.prioridade, 
          dadosBase.estimativa, dadosAtualizacao.dataVencimento
        );
        break;
      case 'recorrente':
        if (!dadosAtualizacao.repeticao) {
          throw new Error('Repetição é obrigatória para tarefa recorrente');
        }
        novaTarefa = this.fabricaTarefas.criarTarefaRecorrente(
          dadosBase.titulo, dadosBase.descricao, dadosBase.prioridade,
          dadosBase.estimativa, dadosAtualizacao.repeticao, dadosAtualizacao.dataVencimento || null
        );
        break;
      default:
        throw new Error(`Tipo de tarefa inválido: ${novoTipo}`);
    }

    novaTarefa.id = tarefaAtual.id;
    novaTarefa.criadoEm = dadosBase.criadoEm;
    novaTarefa.concluida = dadosBase.concluida;
    novaTarefa.atualizadoEm = dadosBase.atualizadoEm;

    const session = await this.modelo.startSession();
    try {
      await session.withTransaction(async () => {
        await this.modelo.deleteOne({ _id: tarefaAtual._id }).session(session);
        await novaTarefa.save({ session });
      });
      return novaTarefa;
    } finally {
      await session.endSession();
    }
  }
}

export class PersistenciaMock extends PersistenciaTarefa {
  constructor() {
    super();
    this.tarefas = new Map();
  }
  
  async salvar(tarefa) {
    this.tarefas.set(tarefa.id, { ...tarefa });
    return tarefa;
  }
  
  async buscarPorId(id) {
    const tarefa = this.tarefas.get(id);
    if (!tarefa) {
      throw new Error('Tarefa não encontrada');
    }
    return tarefa;
  }
  
  async buscarTodos() {
    return Array.from(this.tarefas.values());
  }
  
  async atualizar(id, dados) {
    const tarefa = await this.buscarPorId(id);
    const tarefaAtualizada = { ...tarefa, ...dados, atualizadoEm: new Date() };
    this.tarefas.set(id, tarefaAtualizada);
    return tarefaAtualizada;
  }
  
  async deletar(id) {
    if (!this.tarefas.has(id)) {
      throw new Error('Tarefa não encontrada');
    }
    this.tarefas.delete(id);
    return true;
  }
  
  async converterTipo(tarefaAtual, novoTipo, dadosAtualizacao) {
    const dadosAtualizados = {
      ...dadosAtualizacao,
      tipo: novoTipo,
      atualizadoEm: new Date()
    };
    return await this.atualizar(tarefaAtual.id, dadosAtualizados);
  }
}
