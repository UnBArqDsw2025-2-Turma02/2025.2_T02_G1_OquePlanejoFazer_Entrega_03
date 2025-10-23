import CategoriaService from '../services/CategoriaService.js';

class CategoriaController {
  async criarCategoria(req, res) {
    try {
      const { nome, cor } = req.body;
      if (!nome || !cor) {
        return res.status(400).json({ error: 'Nome e cor da categoria são obrigatórios' });
      }
      const categoria = await CategoriaService.criarCategoria(nome, cor);
      res.status(201).json({ message: 'Categoria criada com sucesso', categoria });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async listarCategorias(req, res) {
    try {
      const categorias = await CategoriaService.listarCategorias();
      res.json({ message: 'Categorias listadas com sucesso', categorias });
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async listarCategoriasPaginadas(req, res) {
    try {
      const { page = 1, limit = 5 } = req.query;
      const result = await CategoriaService.listarCategoriasPaginadas(Number(page), Number(limit));
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async editarCategoria(req, res) {
    try {
      const { id } = req.params;
      const { nome } = req.body;
      const categoria = await CategoriaService.editarCategoria(id, nome);
      res.json({ message: 'Categoria editada com sucesso', categoria });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async removerCategoria(req, res) {
    try {
      const { id } = req.params;
      const categoria = await CategoriaService.removerCategoria(id);
      res.json({ message: 'Categoria removida com sucesso', categoria });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default CategoriaController;