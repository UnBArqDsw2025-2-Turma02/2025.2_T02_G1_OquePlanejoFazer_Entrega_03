import Categoria from '../models/Categoria.js';

class CategoriaController {
  async criarCategoria(req, res) {
    try {
      const { nome } = req.body;
      if (!nome) {
        return res.status(400).json({ error: 'Nome da categoria é obrigatório' });
      }
      const categoria = new Categoria({ nome });
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
