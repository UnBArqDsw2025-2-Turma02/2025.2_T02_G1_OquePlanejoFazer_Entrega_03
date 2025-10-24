import { useState } from "react";
import axios from "axios";

export function useCreateTask() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createMockTask = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post("http://localhost:3333/mock-task");
      return res.data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { createMockTask, loading, error };
}
