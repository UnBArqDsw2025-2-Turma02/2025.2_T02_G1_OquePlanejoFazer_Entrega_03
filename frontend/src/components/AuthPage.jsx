import { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

function AuthPage({ onLoginSuccess }) {
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <div className="auth-container">
      {isLoginView ? (
        <>
          <LoginForm onLoginSuccess={onLoginSuccess} />
          <p>
            Não tem uma conta?{' '}
            <button onClick={() => setIsLoginView(false)} className="toggle-button">
              Cadastre-se
            </button>
          </p>
        </>
      ) : (
        <>
          <RegisterForm onRegisterSuccess={() => setIsLoginView(true)} />
          <p>
            Já tem uma conta?{' '}
            <button onClick={() => setIsLoginView(true)} className="toggle-button">
              Faça login
            </button>
          </p>
        </>
      )}
    </div>
  );
}

export default AuthPage;