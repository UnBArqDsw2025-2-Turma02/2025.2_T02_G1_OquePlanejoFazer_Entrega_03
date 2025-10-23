# Proxy

## Introdução

O padrão **Proxy**, classificado como um padrão estrutural pelo Gang of Four (GoF), tem como objetivo fornecer um substituto ou representante de outro objeto, controlando o acesso a ele. No contexto do projeto "O que planejo fazer", que envolve o gerenciamento de tarefas e hábitos, o Proxy pode ser utilizado para adicionar camadas de controle, como cache, segurança ou log, sem modificar a funcionalidade principal dos serviços.

### Objetivo

O principal objetivo da aplicação do padrão **Proxy** no projeto é introduzir uma camada intermediária entre o cliente (front-end ou outros serviços do back-end) e os serviços reais (como acesso ao banco de dados ou APIs externas). Isso permite adicionar funcionalidades extras de forma transparente, melhorando o desempenho, a segurança e a capacidade de monitoramento do sistema.

As metas fundamentais incluem:

*   **Controle de acesso e segurança:** Implementar validações e verificações de segurança antes que as requisições cheguem ao serviço real.
*   **Otimização de desempenho (Cache):** Armazenar em cache os resultados de operações custosas ou frequentemente acessadas, reduzindo a carga sobre o serviço real e melhorando o tempo de resposta.
*   **Registro de logs:** Registrar todas as interações com o serviço real para fins de auditoria, depuração ou análise de uso.
*   **Gerenciamento de recursos:** Controlar o acesso a recursos limitados, como conexões de banco de dados ou chamadas a APIs de terceiros.


### Metodologia

O processo de aplicação do padrão **Proxy** no projeto envolveu as seguintes etapas:

#### Identificação dos candidatos ideais

Com base na arquitetura do projeto "O que planejo fazer", foi identificado o seguinte componente que se beneficiaria do padrão Proxy:

*   **Proxy de Autenticação para Rotas de API (Node.js):** Para proteger rotas verificando tokens JWT, centralizando a validação de tokens em um único ponto e deixando os controllers focados na lógica de negócio.

#### Definição do ciclo de vida da instância

O Proxy de autenticação atua como um middleware no ciclo de vida da requisição HTTP. Ele é instanciado e executado para cada requisição que passa por uma rota protegida, validando o token antes de permitir que a requisição prossiga para o manipulador da rota.

#### Planejamento da implementação

Os princípios para a implementação do Proxy de autenticação foram definidos:

*   **Interface comum:** O Proxy (`authProxy`) atua como um middleware, interceptando requisições e decidindo se elas podem prosseguir para o recurso real (o controlador da rota).
*   **Referência ao objeto real:** O Proxy não mantém uma referência direta ao objeto real, mas sim atua como um portão que, se a validação for bem-sucedida, permite que a requisição chegue ao controlador da rota.
*   **Adição de lógica:** O Proxy contém a lógica de verificação do token JWT, incluindo a extração do token do cabeçalho, a validação com a chave secreta e a decodificação das informações do usuário.

#### Implementação (Node.js)

**Back-end (Node.js - Proxy de Autenticação para Rotas de API)**

Este exemplo demonstra um Proxy de autenticação que atua como um middleware no Express. Ele verifica a presença e a validade de um token JWT em cada requisição, protegendo as rotas da aplicação.

**Geração do Token (Login)**

Primeiramente, a funcionalidade de login gera um token JWT após a autenticação bem-sucedida do usuário. Este token será então usado nas requisições subsequentes para acessar rotas protegidas.

Exemplo de método `login` no controller:

```javascript
// backend/src/controllers/AuthController.js
import jwt from 'jsonwebtoken';
// ...existing code...
class AuthController {
  // ...existing methods...

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
```

**Implementação do Proxy (Middleware de Validação)**

```javascript
// backend/src/middlewares/AuthProxy.js
import jwt from 'jsonwebtoken';

const authProxy = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido ou mal formatado.' });
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Token inválido ou expirado.' });
    req.userId = decoded.id;
    next();
  });
};

export default authProxy;
```

Como usar: aplicar `authProxy` nas rotas protegidas, por exemplo:
```javascript
// ...existing code...
app.get('/api/me', authProxy, (req, res) => {
  res.json({ message: 'Acesso autorizado pelo Proxy!', userId: req.userId });
});
```

#### Integração ao sistema

O `authProxy` é integrado às rotas do Express que exigem autenticação. Ele é aplicado como um middleware antes do controlador da rota, garantindo que a validação do token ocorra antes que a lógica de negócio seja executada.

```javascript
// backend/src/routes/authRoutes.js (Exemplo de uso)
import express from 'express';
import AuthController from '../controllers/AuthController.js';
import authProxy from '../middlewares/authProxy.js';

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Exemplo de rota protegida pelo authProxy
router.get('/protected-route', authProxy, (req, res) => {
  res.status(200).json({ message: `Acesso concedido ao usuário ${req.userId}` });
});

export default router;
```
#### Testes e validação

Foram realizados testes para confirmar:

*   Que requisições sem token ou com token mal formatado são rejeitadas com status 401.
*   Que requisições com token inválido ou expirado são rejeitadas com status 401.
*   Que requisições com token válido permitem o acesso à rota protegida.
*   Que o `req.userId` é corretamente populado com o ID do usuário decodificado do token.

**Como testar (login + rota protegida):**

1.  **Fazer login para obter token:**

    ```bash
    curl -X POST http://localhost:3333/api/login \
      -H "Content-Type: application/json" \
      -d '{"email":"teste@exemplo.com","password":"senha123"}'
    ```

2.  **Acessar rota protegida sem token (deve falhar):**

    ```bash
    curl http://localhost:3333/api/protected-route
    # Esperado: 401 Unauthorized
    ```

3.  **Acessar rota protegida com token (deve permitir):**

    ```bash
    curl http://localhost:3333/api/protected-route \
      -H "Authorization: Bearer SEU_TOKEN_AQUI"
    # Esperado: resposta com userId e mensagem de sucesso
    ```
 
**Observações finais**

- Mantenha variáveis sensíveis (como JWT_SECRET) em variáveis de ambiente.
- Logger/serviços reais (envio de e-mail) podem substituir os `console.log` dos exemplos.
- O padrão Proxy e os middlewares facilitam a manutenção e a segurança das rotas.

## Vídeo Explicativo

[Link para o vídeo explicativo do código (a ser inserido)]

## Justificativa de Uso

*   O **`authProxy` (Node.js)** é fundamental para implementar uma camada de segurança robusta na API. Ele centraliza a lógica de verificação de tokens JWT, garantindo que todas as rotas protegidas apliquem a mesma política de segurança de forma consistente. Isso evita a duplicação de código de autenticação em cada controlador e facilita a manutenção e evolução das regras de segurança.
*   O padrão Proxy, neste caso, permite a **separação de preocupações (Separation of Concerns)**, isolando a preocupação de segurança (autenticação) da preocupação de negócio (lógica do controlador). Isso torna o código mais limpo, modular e fácil de entender e testar.
