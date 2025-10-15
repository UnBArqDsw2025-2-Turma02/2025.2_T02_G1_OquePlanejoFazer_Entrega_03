# O que planejo fazer

## Introdução

Este repositório reúne toda a documentação do projeto referente a terceira entrega na Disciplina de Arquitetura e Desenho de Software do período 2025.2 ministrada pela professora Dra. Milene Serrano.

## Contribuidor(es)
  
<center> 
  
<table style="width: 100%;">
  <tr>
    <td align="center">
      <a href="https://github.com/Brenno-Silva01">
        <img style="border-radius: 50%;" src="https://github.com/Brenno-Silva01.png" width="100px;" alt="Imagem de Brenno Oliveira"/><br />
        <sub><b>Brenno Oliveira</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/camilascareli">
        <img style="border-radius: 50%;" src="https://github.com/camilascareli.png" width="100px;" alt="Imagem de Camila Careli"/><br />
        <sub><b>Camila Careli</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/DanielCoimbra">
        <img style="border-radius: 50%;" src="https://github.com/DanielCoimbra.png" width="100px;" alt="Imagem de Daniel Coimbra"/><br />
        <sub><b>Daniel Coimbra</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/siqueira-prog">
        <img style="border-radius: 50%;" src="https://github.com/siqueira-prog.png" width="100px;" alt="Imagem de Mateus de Siqueira"/><br />
        <sub><b>Mateus Siqueira</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/matix0">
        <img style="border-radius: 50%;" src="https://github.com/matix0.png" width="100px;" alt="Imagem de Mateus Vinicius"/><br />
        <sub><b>Mateus Vinicius</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/mrodrigues14">
        <img style="border-radius: 50%;" src="https://github.com/mrodrigues14.png" width="100px;" alt="Imagem de Matheus Rodrigues"/><br />
        <sub><b>Matheus Rodrigues</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/alvezclari">
        <img style="border-radius: 50%;" src="https://github.com/alvezclari.png" width="100px;" alt="Imagem de Maria Clara"/><br />
        <sub><b>Maria Clara</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/MillenaQueiroz">
        <img style="border-radius: 50%;" src="https://github.com/MillenaQueiroz.png" width="100px;" alt="Imagem de Millena Queiroz"/><br />
        <sub><b>Millena Queiroz</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/nateejpg">
        <img style="border-radius: 50%;" src="https://github.com/nateejpg.png" width="100px;" alt="Imagem de Nathan Abreu"/><br />
        <sub><b>Nathan Abreu</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/yaskisoba">
        <img style="border-radius: 50%;" src="https://github.com/yaskisoba.png" width="100px;" alt="Imagem de Yasmin Oliveira"/><br />
        <sub><b>Yasmin Oliveira</b></sub>
      </a>
    </td>
  </tr>
</table>


</center>


## Pré-requisitos

Antes de começar, confira se você já tem instalado no seu computador:

- [Node.js](https://nodejs.org/) (versão mínima recomendada: 20.19 ou 22.12)
- [npm](https://www.npmjs.com/get-npm) ou [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/) (opcional, caso vá clonar o repositório)

### Instalação do Backend (Node.js)

```shell
cd backend
npm install
cp .env.example .env
npm start
```

### Instalação do Frontend (React)

Abra um novo terminal

```shell
cd frontend
npm install
npm run dev
```

### Instalando o docsify

Execute o comando:

```shell
npm i docsify-cli -g
```

### Executando localmente

Para iniciar o site localmente, utilize o comando:

```shell
docsify serve ./docs
```