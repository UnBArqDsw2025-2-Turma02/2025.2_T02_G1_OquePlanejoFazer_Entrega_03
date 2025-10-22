import { 
  EditarTarefaCommand, 
  EditarTarefaSimplesCommand,
  ConverterParaTarefaComPrazoCommand,
  ConverterParaTarefaRecorrenteCommand 
} from './TarefaCommand.js';

export class TarefaCommandFactory {
  static criarComandoEditarTarefa(tarefaId, dadosAtualizacao, tarefaService) {
    return new EditarTarefaCommand(tarefaId, dadosAtualizacao, tarefaService);
  }

  static criarComandoEditarTarefaSimples(tarefaId, dadosAtualizacao, tarefaService) {
    return new EditarTarefaSimplesCommand(tarefaId, dadosAtualizacao, tarefaService);
  }

  static criarComandoConverterParaComPrazo(tarefaId, dadosAtualizacao, tarefaService) {
    return new ConverterParaTarefaComPrazoCommand(tarefaId, dadosAtualizacao, tarefaService);
  }

  static criarComandoConverterParaRecorrente(tarefaId, dadosAtualizacao, tarefaService) {
    return new ConverterParaTarefaRecorrenteCommand(tarefaId, dadosAtualizacao, tarefaService);
  }

  static criarComandoInteligente(tarefaId, dadosAtualizacao, tarefaService) {
    if (dadosAtualizacao.repeticao) {
      return this.criarComandoConverterParaRecorrente(tarefaId, dadosAtualizacao, tarefaService);
    }
    
    if (dadosAtualizacao.dataVencimento && !dadosAtualizacao.repeticao) {
      return this.criarComandoConverterParaComPrazo(tarefaId, dadosAtualizacao, tarefaService);
    }
    
    return this.criarComandoEditarTarefa(tarefaId, dadosAtualizacao, tarefaService);
  }
}
