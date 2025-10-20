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

    // Executar edição
    return await this.tarefaService.editarTarefa(this.tarefaId, this.dadosAtualizacao);
  }
}
