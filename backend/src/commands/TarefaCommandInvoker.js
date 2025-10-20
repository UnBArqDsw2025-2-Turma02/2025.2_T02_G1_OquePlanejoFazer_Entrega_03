// MVP - Invoker simples
export class TarefaCommandInvoker {
  async executarComando(comando) {
    return await comando.execute();
  }
}
