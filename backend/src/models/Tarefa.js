import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const tarefaSchemaOptions = {
  discriminatorKey: 'tipo',
  collection: 'tarefas',
};

const tarefaSchema = new Schema({
  descricao: { type: String, required: true },
  categoria: { type: Schema.Types.ObjectId, ref: 'Categoria', required: true },
  prioridade: { type: String, enum: ['Baixa', 'Média', 'Alta'], default: 'Média' },
  concluida: { type: Boolean, default: false },
  criadoEm: { type: Date, default: Date.now }
}, tarefaSchemaOptions);

const Tarefa = mongoose.model('Tarefa', tarefaSchema);

// ---- DISCRIMINATORS ----

// 1. Tarefa Simples
const TarefaSimples = Tarefa.discriminator('simples', new Schema({}));

// 2. Tarefa com Prazo
const TarefaComPrazo = Tarefa.discriminator('comPrazo', new Schema({
  prazo: { type: Date, required: true }
}));

// 3. Tarefa Recorrente
const TarefaRecorrente = Tarefa.discriminator('recorrente', new Schema({
  frequencia: { 
    type: String, 
    required: true,
    enum: ['diaria', 'semanal', 'mensal'] 
  }
}));

export { Tarefa, TarefaSimples, TarefaComPrazo, TarefaRecorrente };
