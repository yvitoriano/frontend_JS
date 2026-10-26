
# NADO LIVRE

## Estudo de Caso 2 — Sistema de Controle de Toalhas em uma Escola de Natação

**Equipe:** 4V - Informática para Internet

### Integrantes

- Elouise da Costa Galdino
- Erick Wellingthon Dantas de Oliveira Gomes
- Sarah Beatriz Buarque da Silva
- Vitória Emilly de Brito Nogueira
- Yasmin da Silva Vitoriano Medeiros

## Sobre o projeto

O Nado Livre é um sistema desenvolvido para auxiliar no gerenciamento de toalhas em uma escola de natação. O sistema permite cadastrar nadadores, funcionários e toalhas, além de controlar as retiradas, devoluções e movimentações realizadas.

## Funcionalidades

- Cadastro de nadadores, funcionários e toalhas.
- Consulta e gerenciamento dos cadastros.
- Registro de retirada e devolução de toalhas.
- Controle do status das toalhas, indicando se estão disponíveis ou em uso.
- Registro e consulta das movimentações.
- Armazenamento persistente dos dados utilizando `localStorage`.
- Reconstrução dos objetos e relacionamentos entre movimentações, nadadores, funcionários e toalhas após o carregamento dos dados.
- Regra de integridade que impede a exclusão de cadastros vinculados a movimentações existentes.
- Geração de IDs para identificar os registros.

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- Classes e módulos ES (`import` e `export`).
- Manipulação de eventos.
- `localStorage` para armazenamento dos dados no navegador.

## Organização dos arquivos

O código JavaScript está organizado em módulos:

- `classes/` — contém as classes utilizadas no sistema, responsáveis por representar as entidades do domínio.
- `dados/` — contém as operações de carregamento e armazenamento dos dados.
- `interface/` — contém a lógica de interação com as páginas e os elementos da interface.
- `interface/componentes.js` — reúne funções reutilizáveis para a criação de elementos da interface, como botões, células, cabeçalhos e linhas de tabelas.

## Como executar

1. Abra a pasta do projeto no Visual Studio Code.
2. Inicie um servidor local, por exemplo, utilizando a extensão Live Server.
3. Abra a página `html/index.html`.
4. Utilize o menu para acessar as páginas de cadastro, movimentação e consulta de toalhas.

Os dados são armazenados no `localStorage` do navegador utilizado.

## Frontend v.4 — Criação de um Módulo de Componentes

Nesta versão, o projeto foi refatorado para melhorar a organização do código e separar as responsabilidades das classes do domínio e da interface.

O objetivo da refatoração é centralizar a criação de elementos visuais em um módulo de componentes reutilizáveis, reduzindo a repetição de código e facilitando a manutenção do sistema.

O módulo `JS/interface/componentes.js` disponibiliza funções para criar elementos utilizados nas tabelas, botões de ação, opções de seleção, indicadores de status e componentes de paginação.

Essa organização torna o código mais modular e facilita a reutilização dos componentes em diferentes partes do sistema.

**Branch de desenvolvimento:** `versao-4`
