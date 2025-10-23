import { useState } from 'react';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import './App.css'; 

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLoginSuccess = (newToken) => {
    localStorage.setItem('token', newToken); 
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    setToken(null);
  };

  return (
    <div className="App">
      {token ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <AuthPage onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;