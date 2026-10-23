/**
 * Cria uma opção para um campo de seleção.
 *
 * @param {string|number} valor - Valor da opção.
 * @param {string} texto - Texto apresentado ao usuário.
 * @returns {HTMLOptionElement}
 */
export function criarOpcao(valor, texto) {
    const opcao = document.createElement("option");

    opcao.value = valor;
    opcao.textContent = texto;

    return opcao;
}


/**
 * Cria o cabeçalho de uma tabela.
 *
 * @param {string[]} colunas - Nomes das colunas.
 * @returns {HTMLTableRowElement}
 */
export function criarCabecalhoTabela(colunas) {
    const linha = document.createElement("tr");

    colunas.forEach((coluna) => {
        const th = document.createElement("th");
        th.textContent = coluna;

        linha.appendChild(th);
    });

    return linha;
}


/**
 * Cria o indicador visual do status de uma toalha.
 *
 * @param {string} status
 * @returns {HTMLSpanElement}
 */

export function criarStatusToalha(status) {
    const indicador = document.createElement("span");
    const icone = document.createElement("span");

    let classe = "status-disponivel";
    let simbolo = "✓";

    if (status === "Em uso") {
        classe = "status-em-uso";
        simbolo = "◷";
    } else if (status === "Não devolvida") {
        classe = "status-nao-devolvida";
        simbolo = "!";
    }

    indicador.classList.add("status", classe);
    icone.classList.add("status-icone");

    icone.textContent = simbolo;
    indicador.append(icone, document.createTextNode(` ${status}`));

    return indicador;
}


/**
 * Cria uma célula de tabela.
 *
 * @param {string} texto - Conteúdo textual da célula.
 * @param {string} classe - Classe CSS opcional.
 * @returns {HTMLTableCellElement}
 */
export function criarCelulaTabela(texto, classe = "") {
    const celula = document.createElement("td");

    celula.textContent = texto;

    if (classe) {
        celula.classList.add(classe);
    }

    return celula;
}


/**
 * Cria um botão de paginação.
 *
 * @param {string|number} texto - Texto do botão.
 * @param {Function} acao - Função executada ao clicar.
 * @param {boolean} desabilitado - Indica se o botão está desabilitado.
 * @param {boolean} ativo - Indica se é a página atual.
 * @returns {HTMLButtonElement}
 */
export function criarBotaoPaginacao(
    texto,
    acao,
    desabilitado = false,
    ativo = false
) {
    const botao = document.createElement("button");

    botao.type = "button";
    botao.textContent = texto;
    botao.disabled = desabilitado;

    if (ativo) {
        botao.classList.add("ativo");
    }

    botao.addEventListener("click", acao);

    return botao;
}


/**
 * Cria o botão de edição de um cadastro.
 *
 * @param {number|string} id - Identificador do registro.
 * @returns {HTMLButtonElement}
 */
export function criarBotaoEditar(id, acao = null) {
    const botao = document.createElement("button");

    botao.type = "button";
    botao.classList.add("edit-btn");
    botao.dataset.editar = id;
    botao.textContent = "Editar";

    if (typeof acao === "function") {
        botao.addEventListener("click", () => acao(id));
    }

    return botao;
}


/**
 * Cria o botão de exclusão de um cadastro.
 *
 * @param {number|string} id - Identificador do registro.
 * @param {Function|null} acao - Callback opcional executado ao clicar.
 * @returns {HTMLButtonElement}
 */
export function criarBotaoExcluir(id, acao = null) {
    const botao = document.createElement("button");

    botao.type = "button";
    botao.classList.add("delete-btn");
    botao.dataset.excluir = id;
    botao.setAttribute("aria-label", "Excluir");
    botao.title = "Excluir";
    botao.textContent = "🗑";

    if (typeof acao === "function") {
        botao.addEventListener("click", () => acao(id));
    }

    return botao;
}


/**
 * Cria a célula que reúne os botões de ação.
 *
 * @param {number|string} id - Identificador do registro.
 * @param {Function|null} aoEditar - Callback opcional de edição.
 * @param {Function|null} aoExcluir - Callback opcional de exclusão.
 * @returns {HTMLTableCellElement}
 */
export function criarCelulaAcoes(id, aoEditar = null, aoExcluir = null) {
    const celula = document.createElement("td");
    celula.classList.add("actions-cell");

    celula.append(
        criarBotaoEditar(id, aoEditar),
        criarBotaoExcluir(id, aoExcluir)
    );

    return celula;
}


/**
 * Cria a linha de um nadador para a tabela de cadastros.
 *
 * @param {Object} nadador - Dados do nadador.
 * @param {Object} callbacks - Callbacks opcionais aoEditar e aoExcluir.
 * @returns {HTMLTableRowElement}
 */
export function criarLinhaNadador(nadador, callbacks = {}) {
    const linha = document.createElement("tr");

    linha.append(
        criarCelulaTabela(String(nadador.id).padStart(3, "0")),
        criarCelulaTabela(nadador.nome ?? ""),
        criarCelulaTabela(nadador.cpf ?? ""),
        criarCelulaTabela(nadador.telefone ?? ""),
        criarCelulaTabela(nadador.email ?? ""),
        criarCelulaAcoes(nadador.id, callbacks.aoEditar, callbacks.aoExcluir)
    );

    return linha;
}


/**
 * Cria a linha de um funcionário para a tabela de cadastros.
 *
 * @param {Object} funcionario - Dados do funcionário.
 * @param {Object} callbacks - Callbacks opcionais aoEditar e aoExcluir.
 * @returns {HTMLTableRowElement}
 */
export function criarLinhaFuncionario(funcionario, callbacks = {}) {
    const linha = document.createElement("tr");

    linha.append(
        criarCelulaTabela(String(funcionario.id).padStart(3, "0")),
        criarCelulaTabela(funcionario.nome ?? ""),
        criarCelulaTabela(funcionario.cpf ?? ""),
        criarCelulaTabela(funcionario.telefone ?? ""),
        criarCelulaTabela(funcionario.email ?? ""),
        criarCelulaAcoes(funcionario.id, callbacks.aoEditar, callbacks.aoExcluir)
    );

    return linha;
}


/**
 * Cria a linha de uma toalha para a tabela de cadastros.
 *
 * @param {Object} toalha - Dados da toalha.
 * @param {Object} callbacks - Callbacks opcionais aoEditar e aoExcluir.
 * @returns {HTMLTableRowElement}
 */
export function criarLinhaToalha(toalha, callbacks = {}) {
    const linha = document.createElement("tr");

    linha.append(
        criarCelulaTabela(String(toalha.id).padStart(3, "0")),
        criarCelulaTabela(toalha.codigo ?? ""),
        criarCelulaTabela(toalha.status ?? "Disponível"),
        criarCelulaAcoes(toalha.id, callbacks.aoEditar, callbacks.aoExcluir)
    );

    return linha;
}
