class AuthSubject {
  constructor() { this.observers = []; }
  subscribe(observer) { this.observers.push(observer); }
  notify(user) { this.observers.forEach(observer => observer.update(user)); }
}

class EmailService {
  update(user) { console.log(`✉️ SIMULAÇÃO: Enviando e-mail de boas-vindas para ${user.email}`); }
}

class LogService {
  update(user) { console.log(`📝 LOG: Novo usuário cadastrado com sucesso - ${user.email}`); }
}

const authSubject = new AuthSubject();
authSubject.subscribe(new EmailService());
authSubject.subscribe(new LogService());

export default authSubject;