import React, { useEffect, useState } from "react";
import { useCreateTask } from "../hooks/useCreateTask";
import { taskObserver } from "../observers/TaskObserver";
import { MockTaskButton } from "./MockTaskButton";

export function TaskPage() {
  const { createMockTask, loading, error } = useCreateTask();
  const [lastCreatedTask, setLastCreatedTask] = useState(null);

  useEffect(() => {
    const handleTaskCreated = (task) => {
      setLastCreatedTask(task);
      console.log("🟢 Task created and observer notified:", task);
    };

    taskObserver.subscribe(handleTaskCreated);
    return () => taskObserver.unsubscribe(handleTaskCreated);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <div>
        <h1>Task Page</h1>
      </div>
      <div style={{ padding: 20 }}>
        <h1>Mock Task Demo</h1>
        <MockTaskButton />
      </div>
    </div>
  );
}
