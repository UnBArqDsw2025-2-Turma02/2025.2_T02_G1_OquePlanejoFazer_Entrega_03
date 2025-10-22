export class EditarTarefaCommand {
  constructor(tarefaId, dadosAtualizacao, tarefaService) {
    this.tarefaId = tarefaId;
    this.dadosAtualizacao = dadosAtualizacao;
    this.tarefaService = tarefaService;
  }

  async execute() {
    if (this.dadosAtualizacao.titulo && this.dadosAtualizacao.titulo.trim() === '') {
      throw new Error('Título não pode estar vazio');
    }
    
    if (this.dadosAtualizacao.estimativa && this.dadosAtualizacao.estimativa <= 0) {
      throw new Error('Estimativa deve ser maior que zero');
    }

    const tarefaAtual = await this.tarefaService.buscarTarefaPorId(this.tarefaId);
    
    const novoTipo = this.determinarNovoTipo(tarefaAtual.tipo, this.dadosAtualizacao);
    
    if (novoTipo !== tarefaAtual.tipo) {
      return await this.converterTipoTarefa(tarefaAtual, novoTipo, this.dadosAtualizacao);
    } else {
      return await this.tarefaService.editarTarefa(this.tarefaId, this.dadosAtualizacao);
    }
  }

  determinarNovoTipo(tipoAtual, dadosAtualizacao) {
    if (dadosAtualizacao.repeticao) {
      return 'recorrente';
    }
    
    if (dadosAtualizacao.dataVencimento && !dadosAtualizacao.repeticao) {
      return 'comPrazo';
    }
    
    if (tipoAtual !== 'simples' && 
        dadosAtualizacao.dataVencimento === null && 
        dadosAtualizacao.repeticao === null) {
      return 'simples';
    }
    
    return tipoAtual;
  }

  async converterTipoTarefa(tarefaAtual, novoTipo, dadosAtualizacao) {
    const novaTarefa = await this.tarefaService.converterTipoTarefa(
      tarefaAtual, 
      novoTipo, 
      dadosAtualizacao
    );
    
    return novaTarefa;
  }
}

export class EditarTarefaSimplesCommand extends EditarTarefaCommand {
  async execute() {
    if (this.dadosAtualizacao.titulo && this.dadosAtualizacao.titulo.trim() === '') {
      throw new Error('Título não pode estar vazio');
    }
    
    if (this.dadosAtualizacao.estimativa && this.dadosAtualizacao.estimativa <= 0) {
      throw new Error('Estimativa deve ser maior que zero');
    }

    return await this.tarefaService.editarTarefa(this.tarefaId, this.dadosAtualizacao);
  }
}

export class ConverterParaTarefaComPrazoCommand extends EditarTarefaCommand {
  async execute() {
    if (!this.dadosAtualizacao.dataVencimento) {
      throw new Error('Data de vencimento é obrigatória para conversão');
    }

    const tarefaAtual = await this.tarefaService.buscarTarefaPorId(this.tarefaId);
    
    return await this.tarefaService.converterTipoTarefa(
      tarefaAtual, 
      'comPrazo', 
      this.dadosAtualizacao
    );
  }
}

export class ConverterParaTarefaRecorrenteCommand extends EditarTarefaCommand {
  async execute() {
    if (!this.dadosAtualizacao.repeticao) {
      throw new Error('Repetição é obrigatória para conversão');
    }

    const tarefaAtual = await this.tarefaService.buscarTarefaPorId(this.tarefaId);
    
    return await this.tarefaService.converterTipoTarefa(
      tarefaAtual, 
      'recorrente', 
      this.dadosAtualizacao
    );
  }
}
