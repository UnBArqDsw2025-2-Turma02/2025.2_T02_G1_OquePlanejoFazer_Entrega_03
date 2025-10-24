import React, { useEffect } from "react";
import { useTriggerPriorityTask } from "../hooks/useTriggerPriorityTask";
import { taskObserver } from "../observers/TaskObserver";

export function PriorityTriggerButton({ taskId }) {
  const { triggerTask, loading, error } = useTriggerPriorityTask();

  useEffect(() => {
    const handleTaskUpdated = (task) => {
      alert(`🚨 Task ${task._id} is now SUPER PRIORIDADE!`);
    };

    taskObserver.subscribe(handleTaskUpdated);
    return () => taskObserver.unsubscribe(handleTaskUpdated);
  }, []);

  return (
    <div>
      <h1>Botão de Aumentar Prioridade</h1>
      <button onClick={() => triggerTask(taskId)} disabled={loading}>
        {loading ? "Updating..." : "Make SUPER PRIORIDADE"}
      </button>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <div style={{ padding: 20 }}>
        
        
      </div>
    </div>
  );
}
