import { TaskBuilder } from "../builders/TaskBuilder.js";
import { taskObserver } from "../../../frontend/src/observers/TaskObserver.js";
import { Tarefa } from "../models/Tarefa.js";


export async function buildTask(req, res) {
  try {
    const { titulo, prioridade, descricao, tipo, estimativa, concluida } = req.body;

    const task = new TaskBuilder()
      .setTitulo(titulo || "Mock Task Example")
      .setPrioridade(prioridade || "Alta")
      .setDescricao(descricao || "Generated from frontend")
      .setCriadoEm(new Date().toISOString())
      .setAtualizadoEm(new Date().toISOString())
      .setTipo(tipo || 'simples')
      .setEstimativa(estimativa || 100)
      .setConcluida(concluida || false)
      .build();
    await task.save();

    return res.status(201).json(task);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to create mock task" });
  }
}

export async function triggerPriorityChange(req, res) {
  try {
    const { id } = req.params;

    // Find the task by ID
    const task = await Tarefa.findById(id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    // Update its priority to SUPER PRIORIDADE
    task.prioridade = "SUPER PRIORIDADE";
    await task.save();

    // Notify observer
    taskObserver.notify(task);

    return res.status(200).json(task);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to update task priority" });
  }
}
