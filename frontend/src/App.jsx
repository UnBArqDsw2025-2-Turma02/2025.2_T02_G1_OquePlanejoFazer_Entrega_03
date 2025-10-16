import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [msg, setMsg] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000')
      .then(res => setMsg(res.data.message))
      .catch(err => setMsg('Erro ao conectar ao backend'));
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Frontend + Backend conectado</h1>
      <p>{msg}</p>
    </div>
  );
}

export default App;
