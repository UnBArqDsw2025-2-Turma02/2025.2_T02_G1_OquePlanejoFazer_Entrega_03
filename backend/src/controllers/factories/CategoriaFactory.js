const categoriasPadrao = [
  { nome: 'Trabalho', cor: '#FF5733' },
  { nome: 'Pessoal', cor: '#33FF57' },
  { nome: 'Saúde', cor: '#3357FF' },
  { nome: 'Estudos', cor: '#F3FF33' }
];

class CategoriaFactory {
  constructor() {
    this.categorias = [...categoriasPadrao];
    this.coresUsadas = new Set(this.categorias.map(c => c.cor));
  }

  criarCategoria(nome, cor) {
    if (this.categorias.length >= 20) throw new Error('Limite de categorias atingido.');
    if (nome.length < 3 || nome.length > 30) throw new Error('Nome inválido.');
    if (this.coresUsadas.has(cor)) throw new Error('Cor já utilizada.');
    this.categorias.push({ nome, cor });
    this.coresUsadas.add(cor);
    return { nome, cor };
  }

  getCategorias() {
    return this.categorias;
  }
}

export default new CategoriaFactory();