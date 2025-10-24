import axios from "axios";
import { taskObserver } from "../observers/TaskObserver";
import { useState } from "react";

export function useTriggerPriorityTask() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const triggerTask = async (taskId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.put(
        `http://localhost:3333/api/tarefas/${taskId}/trigger-priority`
      );

      taskObserver.notify(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { triggerTask, loading, error };
}
