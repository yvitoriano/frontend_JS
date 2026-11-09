# NADO LIVRE

## Estudo de Caso 2 — Sistema de Controle de Toalhas em uma Escola de Natação

**Equipe:** 4V - Informática para Internet

## Integrantes

- Elouise da Costa Galdino
- Erick Wellingthon Dantas de Oliveira Gomes
- Sarah Beatriz Buarque da Silva
- Vitória Emilly de Brito Nogueira
- Yasmin da Silva Vitoriano Medeiros

## Sobre o projeto

O Nado Livre é um sistema desenvolvido para auxiliar no gerenciamento de toalhas em uma escola de natação. O sistema permite cadastrar nadadores, funcionários e toalhas, além de controlar retiradas, devoluções e movimentações realizadas.

## Funcionalidades

- Cadastro de nadadores, funcionários e toalhas.
- Consulta, edição e exclusão de registros.
- Registro de retirada e devolução de toalhas.
- Controle do status das toalhas, indicando se estão disponíveis ou em uso.
- Consulta das movimentações realizadas.
- Armazenamento persistente dos dados por meio de uma API REST.
- Integração entre movimentações, nadadores, funcionários e toalhas.
- Regra de integridade que impede a exclusão de cadastros vinculados a movimentações existentes.
- Identificação dos registros por IDs textuais gerados pelo JSON Server.

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- Classes e módulos ES (`import` e `export`).
- API REST.
- JSON Server.
- Fetch API para requisições HTTP.
- Métodos HTTP GET, POST, PATCH, PUT e DELETE.
- Async e Await para operações assíncronas.

## Organização dos arquivos

O código JavaScript está organizado em módulos:

- `JS/api/` — contém os módulos responsáveis pela comunicação com a API REST.
- `JS/api/http.js` — centraliza as requisições HTTP e o tratamento de erros.
- `JS/api/nadadores.js` — contém as operações relacionadas aos nadadores.
- `JS/api/funcionarios.js` — contém as operações relacionadas aos funcionários.
- `JS/api/toalhas.js` — contém as operações relacionadas às toalhas.
- `JS/api/movimentacoes.js` — contém as operações relacionadas às movimentações.
- `JS/classes/` — contém as classes utilizadas para representar as entidades do sistema.
- `JS/interface/` — contém a lógica de interação com as páginas e os elementos da interface.
- `JS/interface/componentes.js` — reúne funções reutilizáveis para a criação de elementos da interface.
- `db.json` — armazena os registros utilizados pelo JSON Server.
- `package.json` — contém as configurações e os comandos necessários para executar o projeto.

## Como executar

### 1. Instalar as dependências

Abra a pasta principal do projeto no Visual Studio Code e execute o seguinte comando no terminal:

```bash
npm install
```

### 2. Iniciar a API

No terminal, execute:

```bash
npm run api
```

O JSON Server será iniciado na porta `3000`.

Os endpoints disponíveis são:

- `http://localhost:3000/nadadores`
- `http://localhost:3000/funcionarios`
- `http://localhost:3000/toalhas`
- `http://localhost:3000/movimentacoes`

**Importante:** mantenha o terminal da API aberto enquanto utilizar o sistema.

### 3. Abrir o sistema

Com a API em funcionamento:

1. Abra o projeto no Visual Studio Code.
2. Inicie um servidor local utilizando a extensão Live Server.
3. Abra a página `html/index.html`.
4. Utilize o menu para acessar as páginas de cadastro, movimentação e consulta de toalhas.

A API e o servidor local do frontend devem permanecer em execução durante o uso do sistema.

## Armazenamento dos dados

Na versão 5, o armazenamento foi adaptado para utilizar uma API REST com JSON Server, substituindo a dependência do `localStorage`.

Os dados ficam registrados no arquivo `db.json`, permitindo que as informações permaneçam salvas após atualizar ou fechar o navegador.

As operações de consulta, cadastro, atualização e exclusão são realizadas por requisições HTTP.

## Frontend v.5 — Integração com API REST

Nesta versão, o projeto foi adaptado para utilizar uma API REST como forma de comunicação e persistência dos dados.

Foi desenvolvido um módulo HTTP compartilhado para centralizar as requisições e o tratamento de erros. Também foram criados módulos específicos para cada recurso do sistema: nadadores, funcionários, toalhas e movimentações.

As interfaces de cadastro, movimentação e consulta de toalhas foram adaptadas para trabalhar com dados obtidos da API, utilizando operações assíncronas com `async` e `await`.

Também foram preservadas as funcionalidades existentes, como filtros, paginação, validações, relacionamentos e regras de negócio.

## Testes e validações

Durante a adaptação da versão 5, foram realizados testes para verificar:

- Consulta e carregamento dos registros pela API.
- Cadastro, edição e exclusão de registros.
- Impedimento de exclusão de cadastros vinculados a movimentações.
- Validação de códigos duplicados de toalhas.
- Funcionamento dos filtros e da paginação.
- Registro de retiradas e devoluções.
- Atualização dos status das toalhas.
- Preservação dos relacionamentos entre os registros.
- Identificação de falhas quando a API está indisponível.
- Recuperação do funcionamento após reiniciar o JSON Server.

## Branch de desenvolvimento

`versao-5`