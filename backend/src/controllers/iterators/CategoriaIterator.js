import Categoria from '../../models/Categoria.js';

class CategoriaIterator {
  constructor(filtro = {}, page = 1, limit = 5) {
    this.filtro = filtro;
    this.page = parseInt(page, 10);
    this.limit = parseInt(limit, 10);
    this.total = 0;
  }

  async getCurrentPage() {
    const skip = (this.page - 1) * this.limit;

    const categorias = await Categoria.find(this.filtro)
      .sort({ criadoEm: -1 })
      .skip(skip)
      .limit(this.limit);

    if (this.total === 0) {
      this.total = await Categoria.countDocuments(this.filtro);
    }

    return categorias;
  }

  hasNext() {
    return (this.page * this.limit) < this.total;
  }

  getPaginationInfo() {
    return {
      totalItems: this.total,
      totalPages: Math.ceil(this.total / this.limit),
      currentPage: this.page,
      hasNext: this.hasNext(),
    };
  }
}

export default CategoriaIterator;