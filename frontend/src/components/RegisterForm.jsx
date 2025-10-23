import { useState } from 'react';
import axios from 'axios';

function RegisterForm({ onRegisterSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post('http://localhost:3333/api/register', {
        email,
        password,
      });
      setSuccess('Cadastro realizado com sucesso! Você já pode fazer o login.');
      onRegisterSuccess(); 
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao cadastrar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Cadastro</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Cadastrando...' : 'Cadastrar'}
      </button>
    </form>
  );
}

export default RegisterForm;