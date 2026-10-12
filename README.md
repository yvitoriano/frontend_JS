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

O NadoLivre é um sistema desenvolvido para auxiliar no gerenciamento de toalhas em uma escola de natação. O sistema permite cadastrar nadadores, funcionários e toalhas, além de controlar as retiradas, devoluções e movimentações realizadas.

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
- Classes, módulos ES (`import` e `export`) e manipulação de eventos.
- `localStorage` para armazenamento dos dados no navegador.

## Organização dos arquivos

O código JavaScript está organizado em módulos:

- **`classes/`** — contém as classes utilizadas no sistema.
- **`dados/`** — contém as operações de carregamento e armazenamento dos dados.
- **`interface/`** — contém a lógica de interação com as páginas e os elementos da interface.

## Como executar

1. Abra a pasta do projeto no Visual Studio Code.
2. Inicie um servidor local, por exemplo, utilizando a extensão Live Server.
3. Abra a página `index.html`.
4. Utilize o menu para acessar as páginas de cadastro, movimentação e consulta de toalhas.

Os dados são armazenados no `localStorage` do navegador utilizado.

## Frontend v.3

Nesta versão, o projeto foi aprimorado com:

- Persistência dos dados com `localStorage`.
- Reconstrução das classes e dos relacionamentos entre os objetos após o carregamento.
- Aplicação da regra de integridade para impedir exclusões que comprometam as movimentações registradas.
- Organização do código em módulos, separando classes, dados e interface.
- Ajustes e testes das funcionalidades de retirada, devolução e controle de status das toalhas.

**Branch de desenvolvimento:** `frontend-v3`