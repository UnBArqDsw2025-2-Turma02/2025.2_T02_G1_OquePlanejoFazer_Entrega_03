import mongoose from 'mongoose';

const gerarIdAleatorio = () => {
  return Math.random().toString(36).substr(2, 9);
};

const tarefaSchema = new mongoose.Schema({
  id: { 
    type: String, 
    default: gerarIdAleatorio,
    unique: true 
  },
  titulo: { 
    type: String, 
    required: true 
  },
  descricao: { 
    type: String, 
    required: true 
  },
  prioridade: { 
    type: String, 
    enum: ['Baixa', 'Média', 'Alta', 'SUPER PRIORIDADE'], 
    default: 'Média' 
  },
  estimativa: { 
    type: Number, 
    required: true 
  },
  criadoEm: { 
    type: Date, 
    default: Date.now 
  },
  atualizadoEm: { 
    type: Date, 
    default: Date.now 
  },
  concluida: { 
    type: Boolean, 
    default: false 
  },
  tipo: {
    type: String,
    enum: ['simples', 'comPrazo', 'recorrente'],
    required: true
  }
}, {
  timestamps: true
});

tarefaSchema.methods.editar = function({ titulo, descricao, prioridade, estimativa, dataVencimento, repeticao }) {
  if (titulo) this.titulo = titulo;
  if (descricao) this.descricao = descricao;
  if (prioridade) this.prioridade = prioridade;
  if (estimativa) this.estimativa = estimativa;
  if (dataVencimento !== undefined) this.dataVencimento = dataVencimento;
  if (repeticao !== undefined) this.repeticao = repeticao;
  this.atualizadoEm = new Date();
};

tarefaSchema.methods.concluir = function() {
  this.concluida = true;
  this.atualizadoEm = new Date();
  return `Tarefa "${this.titulo}" concluída!`;
};

tarefaSchema.methods.remover = function() {
  return `Tarefa "${this.titulo}" removida`;
};

const tarefaSimplesSchema = new mongoose.Schema({
}, {
  discriminatorKey: 'tipo'
});

const tarefaComPrazoSchema = new mongoose.Schema({
  dataVencimento: { 
    type: Date, 
    required: true 
  }
}, {
  discriminatorKey: 'tipo'
});

const tarefaRecorrenteSchema = new mongoose.Schema({
  repeticao: { 
    type: String, 
    required: true,
    enum: ['diária', 'semanal', 'mensal', 'anual']
  },
  dataVencimento: { 
    type: Date, 
    default: null 
  }
}, {
  discriminatorKey: 'tipo'
});

const Tarefa = mongoose.model('Tarefa', tarefaSchema);
const TarefaSimples = Tarefa.discriminator('simples', tarefaSimplesSchema);
const TarefaComPrazo = Tarefa.discriminator('comPrazo', tarefaComPrazoSchema);
const TarefaRecorrente = Tarefa.discriminator('recorrente', tarefaRecorrenteSchema);

// Abstract Factory

class FabricaTarefas {
  criarTarefa() {
    throw new Error('Método criarTarefa deve ser implementado pela subclasse');
  }
}

class FabricaTarefasPontuais extends FabricaTarefas {
  criarTarefa(titulo, descricao, prioridade, estimativa) {
    return new TarefaSimples({
      titulo,
      descricao,
      prioridade,
      estimativa,
      tipo: 'simples'
    });
  }
}

class FabricaTarefasTemporais extends FabricaTarefas {
  criarTarefaComPrazo(titulo, descricao, prioridade, estimativa, dataVencimento) {
    return new TarefaComPrazo({
      titulo,
      descricao,
      prioridade,
      estimativa,
      dataVencimento,
      tipo: 'comPrazo'
    });
  }

  criarTarefaRecorrente(titulo, descricao, prioridade, estimativa, repeticao, dataVencimento = null) {
    return new TarefaRecorrente({
      titulo,
      descricao,
      prioridade,
      estimativa,
      repeticao,
      dataVencimento,
      tipo: 'recorrente'
    });
  }
}

class GerenciadorFabricaTarefas {
  constructor() {
    this.fabricaPontual = new FabricaTarefasPontuais();
    this.fabricaTemporal = new FabricaTarefasTemporais();
  }

  criarTarefaSimples(titulo, descricao, prioridade, estimativa) {
    return this.fabricaPontual.criarTarefa(titulo, descricao, prioridade, estimativa);
  }

  criarTarefaComPrazo(titulo, descricao, prioridade, estimativa, dataVencimento) {
    return this.fabricaTemporal.criarTarefaComPrazo(titulo, descricao, prioridade, estimativa, dataVencimento);
  }

  criarTarefaRecorrente(titulo, descricao, prioridade, estimativa, repeticao, dataVencimento) {
    return this.fabricaTemporal.criarTarefaRecorrente(titulo, descricao, prioridade, estimativa, repeticao, dataVencimento);
  }
}

// === OBSERVER PATTERN FOR PRIORITY CHANGES ===
class ObservadorTarefa {
  atualizar(tarefa, acao) {
    throw new Error('Método atualizar() deve ser implementado');
  }
}

class LoggerObserver extends ObservadorTarefa {
  atualizar(tarefa, acao) {
    console.log(`[SERVER LOG] ${acao} — ${tarefa.titulo} | Nova prioridade: ${tarefa.prioridade}`);
  }
}

class NotifierObserver extends ObservadorTarefa {
  constructor(emitter) {
    super();
    this.emitter = emitter;
  }

  atualizar(tarefa, acao) {
    this.emitter.emit('tarefaAtualizada', {
      id: tarefa.id,
      titulo: tarefa.titulo,
      prioridade: tarefa.prioridade,
      mensagem: `Prioridade alterada para ${tarefa.prioridade}`,
      timestamp: new Date()
    });
  }
}

class SujeitoTarefa {
  constructor() {
    this.observadores = [];
  }

  adicionarObservador(obs) {
    this.observadores.push(obs);
  }

  notificar(tarefa, acao) {
    for (const obs of this.observadores) {
      obs.atualizar(tarefa, acao);
    }
  }
}

// === Global instance (shared between model and server setup) ===
const gerenteObservadores = new SujeitoTarefa();

tarefaSchema.methods.alterarPrioridade = function (novaPrioridade) {
  const antiga = this.prioridade;
  this.prioridade = novaPrioridade;
  this.atualizadoEm = new Date();

  gerenteObservadores.notificar(this, `Mudança de prioridade de ${antiga} → ${novaPrioridade}`);
  return `Prioridade alterada de ${antiga} para ${novaPrioridade}`;
};

export {
  Tarefa,
  TarefaSimples,
  TarefaComPrazo,
  TarefaRecorrente,
  FabricaTarefas,
  FabricaTarefasPontuais,
  FabricaTarefasTemporais,
  GerenciadorFabricaTarefas,
  gerenteObservadores,
  LoggerObserver,
  NotifierObserver
};

