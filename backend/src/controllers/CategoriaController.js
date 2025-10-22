import Categoria from '../models/Categoria.js';
import CategoriaFactory from './factories/CategoriaFactory.js';
import CategoriaIterator from './iterators/CategoriaIterator.js';

class CategoriaController {
  async criarCategoria(req, res) {
    try {
      const { nome, cor } = req.body;
      if (!nome || !cor) {
        return res.status(400).json({ error: 'Nome e cor da categoria são obrigatórios' });
      }

      // Usando Factory para validar e criar categoria
      try {
        CategoriaFactory.criarCategoria(nome, cor);
      } catch (err) {
        return res.status(400).json({ error: err.message });
      }

      const categoria = new Categoria({ nome, cor });
      await categoria.save();
      res.status(201).json({ message: 'Categoria criada com sucesso', categoria });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({ error: 'Categoria já existe' });
      }
      console.error('Erro ao criar categoria:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async listarCategorias(req, res) {
    try {
      const categorias = await Categoria.find().sort({ criadoEm: -1 });
      res.json({ message: 'Categorias listadas com sucesso', categorias });
    } catch (error) {
      console.error('Erro ao listar categorias:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  //lista categorias com paginacao usando o iterator
  async listarCategoriasPaginadas(req, res) {
    try {
      const { page = 1, limit = 5 } = req.query;
      const iterator = new CategoriaIterator({}, page, limit);
      const categorias = await iterator.getCurrentPage();
      const pagination = iterator.getPaginationInfo();
      res.json({ categorias, pagination });
    } catch (error) {
      console.error('Erro ao listar categorias paginadas:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async editarCategoria(req, res) {
    try {
      const { id } = req.params;
      const { nome } = req.body;
      const categoria = await Categoria.findById(id);
      if (!categoria) {
        return res.status(404).json({ error: 'Categoria não encontrada' });
      }
      if (nome) categoria.nome = nome;
      await categoria.save();
      res.json({ message: 'Categoria editada com sucesso', categoria });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({ error: 'Categoria já existe' });
      }
      console.error('Erro ao editar categoria:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async removerCategoria(req, res) {
    try {
      const { id } = req.params;
      const categoria = await Categoria.findById(id);
      if (!categoria) {
        return res.status(404).json({ error: 'Categoria não encontrada' });
      }
      await Categoria.deleteOne({ _id: id });
      res.json({ message: 'Categoria removida com sucesso', categoriaRemovida: categoria });
    } catch (error) {
      console.error('Erro ao remover categoria:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

export default CategoriaController;
