# NADO LIVRE

## Estudo de Caso 2 — Sistema de Controle de Toalhas em uma Escola de Natação

**Equipe:** 4V - Informática para Internet

## Sobre o projeto

O Nado Livre é um sistema para gerenciamento de toalhas em uma escola de natação. Permite cadastrar nadadores, funcionários e toalhas, registrar retiradas e devoluções e consultar o status e o histórico das toalhas.

## Tecnologias

- Frontend: HTML5, CSS3 e JavaScript (módulos ES).
- Backend: Python, Flask, Flask-SQLAlchemy e Marshmallow.
- Banco de dados: SQLite.
- Comunicação: API REST com Fetch API e JSON.

## Organização

- `html/` — páginas do sistema.
- `css/` — estilos das páginas.
- `img/` — imagens e ícones.
- `JS/api/` — comunicação HTTP e operações dos recursos da API.
- `JS/classes/` — classes de funcionário, nadador, toalha e movimentação.
- `JS/interface/` — lógica das telas e componentes reutilizáveis.
- `db.json` — arquivo legado da versão anterior com JSON Server; não é utilizado nesta integração.

## Como executar no Windows (CMD)

O frontend e o backend são independentes e devem ser iniciados em dois terminais diferentes.

### 1. Preparar o backend

Abra o CMD e entre na pasta `nado-livre-api`:

```cmd
cd caminho\para\nado-livre-api
```

Crie e ative o ambiente virtual:

```cmd
py -m venv venv
venv\Scripts\activate
```

Instale as dependências:

```cmd
py -m pip install -r requirements.txt
```

Inicie a API:

```cmd
py app.py
```

A API ficará disponível em `http://127.0.0.1:5000`. O banco SQLite `instance/nado_livre.db` será criado automaticamente.

Teste no navegador abrindo `http://127.0.0.1:5000`. A resposta esperada é uma mensagem informando que a API está funcionando.

### 2. Preparar o frontend

Abra um segundo CMD e entre na pasta `frontend_JS`:

```cmd
cd caminho\para\frontend_JS
```

Inicie o servidor local do frontend:

```cmd
py -m http.server 5501
```

Abra no navegador:

`http://127.0.0.1:5501/html/index.html`

Mantenha os dois terminais abertos enquanto utiliza o sistema. Não abra os arquivos HTML diretamente pelo explorador; use o endereço do servidor local para que os módulos JavaScript funcionem corretamente.

> Se preferir, pode utilizar a extensão Live Server do VS Code para abrir `html/index.html`. A API continuará sendo executada separadamente na porta 5000.

## Como testar a integração

Faça os testes na ordem abaixo para que os registros necessários existam antes das movimentações.

1. **Conferir a API:** abra `http://127.0.0.1:5000` e confirme a mensagem de funcionamento.
2. **Cadastrar funcionário:** na tela de cadastro, registre um funcionário com nome, CPF, telefone e e-mail.
3. **Cadastrar nadador:** registre um nadador com dados diferentes dos utilizados no funcionário.
4. **Cadastrar toalhas:** cadastre pelo menos duas toalhas com códigos diferentes.
5. **Consultar cadastros:** abra as listas de funcionários, nadadores e toalhas e confira se os registros aparecem com seus IDs.
6. **Editar cadastro:** altere o nome ou telefone de um funcionário/nadador e confirme se a lista apresenta o novo dado.
7. **Retirar toalha:** na tela de movimentação, selecione um nadador, um funcionário e uma toalha disponível. Após confirmar, a toalha deve passar para `Em uso`.
8. **Conferir a retirada:** abra a tela de consulta de toalhas. A toalha deve aparecer com status `Em uso`, e o registro deve constar em `http://127.0.0.1:5000/movimentacoes`.
9. **Devolver toalha:** selecione a toalha em uso, informe o funcionário responsável pela devolução e confirme. A toalha deve voltar para `Disponível`.
10. **Conferir a devolução:** consulte novamente `http://127.0.0.1:5000/movimentacoes`. O registro da retirada deve conter `data_hora_devolucao` preenchida; a devolução atualiza a mesma movimentação, não cria uma segunda retirada.
11. **Testar regras:** tente retirar uma toalha já em uso e tente cadastrar códigos repetidos. A API deve impedir essas operações.
12. **Testar exclusão:** um cadastro vinculado a movimentações não pode ser excluído. Uma toalha sem movimentações pode ser excluída.

## Endpoints principais

| Método | Endpoint | Função |
|---|---|---|
| GET, POST | `/funcionarios` | Listar e cadastrar funcionários |
| GET, PATCH, DELETE | `/funcionarios/<id>` | Consultar, editar e excluir funcionário |
| GET, POST | `/nadadores` | Listar e cadastrar nadadores |
| GET, PATCH, DELETE | `/nadadores/<id>` | Consultar, editar e excluir nadador |
| GET, POST | `/toalhas` | Listar e cadastrar toalhas |
| GET, PATCH, DELETE | `/toalhas/<id>` | Consultar, editar e excluir toalha |
| GET | `/toalhas/disponiveis` | Listar toalhas disponíveis |
| GET | `/toalhas/em-uso` | Listar toalhas em uso |
| GET, POST | `/movimentacoes` | Listar movimentações e registrar retirada |
| PUT | `/toalhas/<id>/devolucao` | Registrar devolução da toalha em uso |
| GET | `/movimentacoes/em-aberto` | Listar retiradas ainda não devolvidas |
| GET | `/toalhas/<id>/historico` | Consultar histórico da toalha |

## Persistência e integração

O frontend envia e recebe dados por requisições HTTP para a API Flask (`http://127.0.0.1:5000`). A API aplica as regras de negócio e persiste os registros no SQLite. O arquivo `db.json` pertence à versão anterior baseada em JSON Server e não participa mais do funcionamento.

O backend controla o status da toalha: ao registrar uma retirada, altera para `Em uso`; ao registrar a devolução, altera para `Disponível`. Cada retirada é representada por uma movimentação, cuja data de devolução é preenchida quando a toalha retorna.
