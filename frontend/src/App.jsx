import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TaskPage } from './components/TaskPage';

function App() {
  const [msg, setMsg] = useState('');
  const [notification, setNotification] = useState("Esperando criação da tarefa");

  useEffect(() => {
    axios.get('http://localhost:3333/test-db')
      .then( res => setMsg(res.data.title + " em " + res.data.createdAt))
      .catch(err => setMsg('Erro ao conectar ao backend'))
  }, []);

  // window.getMsg = () => res;

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <div>
        <h1>Frontend + Backend conectado</h1>
        <p>{msg}</p>
      </div>
      <div>
        <TaskPage />
      </div>
    </div>
  );
}

export default App;
