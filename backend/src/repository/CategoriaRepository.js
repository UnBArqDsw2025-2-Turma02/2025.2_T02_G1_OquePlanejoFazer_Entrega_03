import Categoria from '../models/Categoria.js';

class CategoriaRepository {
  async criar(categoriaData) {
    const categoria = new Categoria(categoriaData);
    return await categoria.save();
  }

  async listarTodos() {
    return await Categoria.find().sort({ criadoEm: -1 });
  }

  async listarPaginado(page = 1, limit = 5) {
    const skip = (page - 1) * limit;
    const categorias = await Categoria.find()
      .sort({ criadoEm: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Categoria.countDocuments();
    return { categorias, total };
  }

  async buscarPorId(id) {
    return await Categoria.findById(id);
  }

  async editar(id, nome) {
    const categoria = await Categoria.findById(id);
    if (!categoria) return null;
    categoria.nome = nome;
    return await categoria.save();
  }

  async remover(id) {
    return await Categoria.findByIdAndDelete(id);
  }
}

export default new CategoriaRepository();