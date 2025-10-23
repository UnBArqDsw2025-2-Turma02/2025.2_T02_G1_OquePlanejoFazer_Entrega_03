import Categoria from '../models/Categoria.js';
import CategoriaFactory from '../controllers/factories/CategoriaFactory.js';
import CategoriaIterator from '../controllers/iterators/CategoriaIterator.js';
import CategoriaRepository from '../repository/CategoriaRepository.js';

class CategoriaService {
  async criarCategoria(nome, cor) {
    CategoriaFactory.criarCategoria(nome, cor);
    const categoria = new Categoria({ nome, cor });
    await categoria.save();
    return categoria;
  }

  async listarCategorias() {
    return await Categoria.find().sort({ criadoEm: -1 });
  }

  async listarCategoriasPaginadas(page = 1, limit = 5) {
    const skip = (page - 1) * limit;
    const categorias = await Categoria.find()
      .sort({ criadoEm: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Categoria.countDocuments();
    return {
      categorias,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        hasNext: (page * limit) < total,
      }
    };
  }

  async editarCategoria(id, nome) {
    const categoria = await Categoria.findById(id);
    if (!categoria) throw new Error('Categoria não encontrada');
    if (nome) categoria.nome = nome;
    await categoria.save();
    return categoria;
  }

  async removerCategoria(id) {
    const categoria = await Categoria.findByIdAndDelete(id);
    if (!categoria) throw new Error('Categoria não encontrada');
    return categoria;
  }
}

export default new CategoriaService();