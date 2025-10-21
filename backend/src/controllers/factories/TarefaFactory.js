// Arquivo: factories/TarefaFactory.js (Versão Discriminator)

// Importamos todos os modelos que o Mongoose nos deu
import { TarefaSimples, TarefaComPrazo, TarefaRecorrente } from '../../models/Tarefa.js';

class TarefaFactory {
  /**
   * Retorna o Modelo Mongoose apropriado com base no tipo.
   * @param {string} tipo - O tipo da tarefa (ex: 'comPrazo').
   * @returns {mongoose.Model} O construtor do modelo Mongoose.
   */
  static getModel(tipo) {
    switch (tipo) {
      case 'comPrazo':
        return TarefaComPrazo;
      case 'recorrente':
        return TarefaRecorrente;
      case 'simples':
      default:
        return TarefaSimples;
    }
  }
}

export default TarefaFactory;