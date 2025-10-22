import { EditarTarefaCommand } from './TarefaCommand.js';

// MVP - Factory simples
export class TarefaCommandFactory {
  static criarComandoEditarTarefa(tarefaId, dadosAtualizacao, tarefaService) {
    return new EditarTarefaCommand(tarefaId, dadosAtualizacao, tarefaService);
  }
}
