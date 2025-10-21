import mongoose from 'mongoose';

const testSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  type: { type: String, enum: ['Alta', 'Média', 'Baixa'], default: 'Média' },
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categoria',
    required: false
  },
  createdAt: { type: Date, default: Date.now },
});

export const Test = mongoose.model('Test', testSchema);