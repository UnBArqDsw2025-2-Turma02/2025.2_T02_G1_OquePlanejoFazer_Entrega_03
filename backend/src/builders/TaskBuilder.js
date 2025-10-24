import { Tarefa } from "../models/Tarefa.js";

export class TaskBuilder {
  constructor() {
    this.tarefa = new Tarefa();
  }

  setTitulo(titulo) {
    this.tarefa.titulo = titulo;
    return this;
  }

  setPrioridade(prioridade) {
    this.tarefa.prioridade = prioridade;
    return this;
  }

  setDescricao(descricao) {
    this.tarefa.descricao = descricao;
    return this;
  }

  setCriadoEm(date = new Date()) {
    this.tarefa.criadoEm = date;
    return this;
  }

  setEstimativa(estimativa){
    this.tarefa.estimativa = estimativa;
    return this;
  }

  setAtualizadoEm(atualizadoEm){
    this.tarefa.atualizadoEm = atualizadoEm;
    return this;
  }

  setTipo(tipo){
    this.tarefa.tipo = tipo;
    return this;
  }
  
  setConcluida(concluida) {
    this.tarefa.concluida = concluida;
    return this;
  }

  build() {
    return this.tarefa;
  }
}