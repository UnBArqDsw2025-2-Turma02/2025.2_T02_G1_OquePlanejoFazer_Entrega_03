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
    enum: ['Baixa', 'Média', 'Alta'], 
    default: 'Média' 
  },
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categoria',
    required: true
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
  criarTarefa(titulo, descricao, prioridade, estimativa, categoria) {
    return new TarefaSimples({
      titulo,
      descricao,
      prioridade,
      estimativa,
      categoria,
      tipo: 'simples'
    });
  }
}

class FabricaTarefasTemporais extends FabricaTarefas {
  criarTarefaComPrazo(titulo, descricao, prioridade, estimativa, dataVencimento, categoria) {
    return new TarefaComPrazo({
      titulo,
      descricao,
      prioridade,
      estimativa,
      dataVencimento,
      categoria,
      tipo: 'comPrazo'
    });
  }

  criarTarefaRecorrente(titulo, descricao, prioridade, estimativa, repeticao, dataVencimento = null, categoria) {
    return new TarefaRecorrente({
      titulo,
      descricao,
      prioridade,
      estimativa,
      repeticao,
      dataVencimento,
      categoria,
      tipo: 'recorrente'
    });
  }
}

class GerenciadorFabricaTarefas {
  constructor() {
    this.fabricaPontual = new FabricaTarefasPontuais();
    this.fabricaTemporal = new FabricaTarefasTemporais();
  }

  criarTarefaSimples(titulo, descricao, prioridade, estimativa, categoria) {
    return this.fabricaPontual.criarTarefa(titulo, descricao, prioridade, estimativa, categoria);
  }

  criarTarefaComPrazo(titulo, descricao, prioridade, estimativa, dataVencimento, categoria) {
    return this.fabricaTemporal.criarTarefaComPrazo(titulo, descricao, prioridade, estimativa, dataVencimento, categoria);
  }

  criarTarefaRecorrente(titulo, descricao, prioridade, estimativa, repeticao, dataVencimento, categoria) {
    return this.fabricaTemporal.criarTarefaRecorrente(titulo, descricao, prioridade, estimativa, repeticao, dataVencimento, categoria);
  }
}

export { 
  Tarefa, 
  TarefaSimples, 
  TarefaComPrazo, 
  TarefaRecorrente,
  FabricaTarefas, 
  FabricaTarefasPontuais, 
  FabricaTarefasTemporais, 
  GerenciadorFabricaTarefas 
};
