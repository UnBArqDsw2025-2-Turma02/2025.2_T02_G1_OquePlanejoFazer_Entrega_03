import User from '../models/User.js';
import authSubject from '../events/AuthObserver.js';
import jwt from 'jsonwebtoken';

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

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Email ou senha inválidos.' });
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

      res.json({ message: 'Login bem-sucedido!', token });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao fazer login.' });
    }
  }
}

export default new AuthController();