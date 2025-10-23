function Dashboard({ onLogout }) {
  return (
    <div className="dashboard-container">
      <h1>Bem-vindo!</h1>
      <p>Você está logado no sistema.</p>
      <button onClick={onLogout}>Sair</button>
    </div>
  );
}

export default Dashboard;