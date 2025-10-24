import React, { useState } from "react";
import { useCreateTask } from "../hooks/useCreateTask";
import { PriorityTriggerButton } from "./PriorityTriggerButton";

export function MockTaskButton() {
  const { createMockTask, loading, error } = useCreateTask();
  const [lastTask, setLastTask] = useState({_id:''});

  const handleClick = async () => {
    const task = await createMockTask();
    if (task) setLastTask(task);
  };

  return (
    <div>
      <button onClick={handleClick} disabled={loading}>
        {loading ? "Creating..." : "Create Mock Task"}
      </button>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {lastTask && (
        <p>
          ✅ Task created: <strong>{lastTask.titulo}</strong> (
          {lastTask.prioridade})
          <strong> {lastTask._id}</strong>
        </p>
          
      )}
      {lastTask._id ? <PriorityTriggerButton taskId={lastTask._id}/> : ""}
    </div>
  );
}
