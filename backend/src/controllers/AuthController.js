import User from '../models/User.js';
import authSubject from '../events/AuthObserver.js';

class AuthController {
  async register(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
      }
      const newUser = await User.create({ email, password });
      authSubject.notify(newUser);
      res.status(201).json({ message: 'Usuário cadastrado com sucesso!', user: newUser });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({ error: 'Este e-mail já está em uso.' });
      }
      res.status(500).json({ error: 'Erro ao registrar usuário.' });
    }
  }
}

export default new AuthController();