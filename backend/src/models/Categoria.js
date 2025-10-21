import mongoose from 'mongoose';

const categoriaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  criadoEm: {
    type: Date,
    default: Date.now
  }
});

const Categoria = mongoose.model('Categoria', categoriaSchema);

export default Categoria;
