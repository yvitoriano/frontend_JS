const STORAGE = {
    nadador: "nadadores",
    funcionario: "funcionarios",
    toalha: "toalhas"
};

const NEXT_ID = {
    nadador: "proximoIdNadador",
    funcionario: "proximoIdFuncionario",
    toalha: "proximoIdToalha"
};

const POR_PAGINA = 10;


let tipoAtual = "nadador";
let paginaAtual = 1;
let termoBusca = "";
let edicaoAtual = null;
let exclusaoAtual = null;


/* LOCAL STORAGE */

function carregar(tipo) {

    try {

        return JSON.parse(
            localStorage.getItem(STORAGE[tipo])
        ) || [];

    } catch (erro) {

        return [];

    }

}


function salvar(tipo, registros) {

    localStorage.setItem(
        STORAGE[tipo],
        JSON.stringify(registros)
    );

}


/* ID AUTOMÁTICO */

function proximoId(tipo) {

    const registros = carregar(tipo);

    const maiorId = registros.reduce(
        function (maior, registro) {

            return Math.max(
                maior,
                Number(registro.id) || 0
            );

        },
        0
    );


    let idAtual =
        Number(
            localStorage.getItem(NEXT_ID[tipo])
        ) || (maiorId + 1);


    if (idAtual <= maiorId) {
        idAtual = maiorId + 1;
    }


    localStorage.setItem(
        NEXT_ID[tipo],
        String(idAtual + 1)
    );


    return idAtual;

}


/* AUXILIARES */

function normalizar(texto) {

    return String(texto ?? "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

}


function escapeHtml(valor) {

    const elemento = document.createElement("div");

    elemento.textContent = String(valor ?? "");

    return elemento.innerHTML;

}


/* ABAS */

const tabs =
    document.querySelectorAll(".tab");

const conteudos =
    document.querySelectorAll(".tab-content");


tabs.forEach(function (tab) {

    tab.addEventListener("click", function () {

        const nomeAba =
            tab.dataset.tab;


        tabs.forEach(function (item) {
            item.classList.remove("active");
        });


        conteudos.forEach(function (conteudo) {
            conteudo.classList.remove("active");
        });


        tab.classList.add("active");


        document
            .getElementById(nomeAba)
            .classList.add("active");

    });

});


/* CADASTRO DE PESSOAS */

function cadastrarPessoa(
    tipo,
    formulario,
    ids
) {

    const registro = {

        id: proximoId(tipo),

        nome:
            document
                .getElementById(ids.nome)
                .value
                .trim(),

        cpf:
            document
                .getElementById(ids.cpf)
                .value
                .trim(),

        telefone:
            document
                .getElementById(ids.telefone)
                .value
                .trim(),

        email:
            document
                .getElementById(ids.email)
                .value
                .trim()

    };


    if (
        !registro.nome ||
        !registro.cpf ||
        !registro.telefone ||
        !registro.email
    ) {
        return;
    }


    const registros =
        carregar(tipo);


    registros.push(registro);


    salvar(
        tipo,
        registros
    );


    if (tipo === "nadador") {

        alert(
            "Nadador cadastrado com sucesso."
        );

    } else {

        alert(
            "Funcionário cadastrado com sucesso."
        );

    }


    formulario.reset();

}


/* NADADOR */

document
    .getElementById("formNadador")
    .addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            cadastrarPessoa(
                "nadador",
                this,
                {
                    nome: "nomeNadador",
                    cpf: "cpfNadador",
                    telefone: "telefoneNadador",
                    email: "emailNadador"
                }
            );

        }
    );


/* FUNCIONÁRIO */

document
    .getElementById("formFuncionario")
    .addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            cadastrarPessoa(
                "funcionario",
                this,
                {
                    nome: "nomeFuncionario",
                    cpf: "cpfFuncionario",
                    telefone: "telefoneFuncionario",
                    email: "emailFuncionario"
                }
            );

        }
    );


/* CADASTRO TOALHA */

document
    .getElementById("formToalha")
    .addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const codigo =
                document
                    .getElementById(
                        "codigoToalha"
                    )
                    .value
                    .trim();


            if (!codigo) {
                return;
            }


            const toalhas =
                carregar("toalha");


            const existe =
                toalhas.some(
                    function (toalha) {

                        return (
                            normalizar(
                                toalha.codigo
                            ) ===
                            normalizar(
                                codigo
                            )
                        );

                    }
                );


            if (existe) {

                alert(
                    "Já existe uma toalha com esse código identificador."
                );

                return;

            }


            const novaToalha = {

                id:
                    proximoId(
                        "toalha"
                    ),

                codigo:
                    codigo,

                status:
                    "Disponível"

            };


            toalhas.push(
                novaToalha
            );


            salvar(
                "toalha",
                toalhas
            );


            alert(
                "Toalha cadastrada com sucesso."
            );


            this.reset();

        }
    );


/* MODAIS */

const modalLista =
    document.getElementById(
        "modalLista"
    );

const modalEdicao =
    document.getElementById(
        "modalEdicao"
    );

const modalConfirmacao =
    document.getElementById(
        "modalConfirmacao"
    );


function abrirModal(modal) {

    modal.classList.add("open");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "modal-open"
    );

}


function fecharModal(modal) {

    modal.classList.remove("open");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    const algumModalAberto =
        document.querySelector(
            ".modal-overlay.open"
        );


    if (!algumModalAberto) {

        document.body.classList.remove(
            "modal-open"
        );

    }

}


/* VER CADASTRADOS */

document
    .querySelectorAll(
        "[data-lista]"
    )
    .forEach(
        function (botao) {

            botao.addEventListener(
                "click",
                function () {

                    tipoAtual =
                        botao.dataset.lista;

                    paginaAtual = 1;

                    termoBusca = "";


                    document
                        .getElementById(
                            "buscaCadastro"
                        )
                        .value = "";


                    abrirModal(
                        modalLista
                    );


                    renderizarLista();

                }
            );

        }
    );


/* FECHAR MODAIS */

document
    .querySelectorAll(
        "[data-fechar]"
    )
    .forEach(
        function (botao) {

            botao.addEventListener(
                "click",
                function () {

                    const tipo =
                        botao.dataset.fechar;


                    const modais = {

                        lista:
                            "modalLista",

                        edicao:
                            "modalEdicao",

                        confirmacao:
                            "modalConfirmacao"

                    };


                    const modal =
                        document.getElementById(
                            modais[tipo]
                        );


                    fecharModal(
                        modal
                    );

                }
            );

        }
    );


/* CLICAR FORA */

[
    modalLista,
    modalEdicao,
    modalConfirmacao
].forEach(
    function (modal) {

        modal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === modal
                ) {

                    fecharModal(
                        modal
                    );

                }

            }
        );

    }
);


/* BUSCA */

document
    .getElementById(
        "buscaCadastro"
    )
    .addEventListener(
        "input",
        function (event) {

            termoBusca =
                event.target.value;

            paginaAtual = 1;

            renderizarLista();

        }
    );


function dadosFiltrados() {

    const pesquisa =
        normalizar(
            termoBusca
        );


    const registros =
        carregar(
            tipoAtual
        );


    return registros.filter(
        function (registro) {

            if (!pesquisa) {
                return true;
            }


            return Object
                .values(registro)
                .some(
                    function (valor) {

                        return normalizar(
                            valor
                        ).includes(
                            pesquisa
                        );

                    }
                );

        }
    );

}


/* RENDERIZAR LISTA */

function renderizarLista() {

    let configuracao;


    if (
        tipoAtual === "toalha"
    ) {

        configuracao = {

            titulo:
                "Toalhas cadastradas",

            colunas: [
                "ID",
                "Código",
                "Status",
                "Ações"
            ]

        };

    } else {

        configuracao = {

            titulo:
                tipoAtual === "nadador"
                    ? "Nadadores cadastrados"
                    : "Funcionários cadastrados",

            colunas: [
                "ID",
                "Nome",
                "CPF",
                "Telefone",
                "E-mail",
                "Ações"
            ]

        };

    }


    document
        .getElementById(
            "tituloLista"
        )
        .textContent =
        configuracao.titulo;


    document
        .getElementById(
            "cabecalhoLista"
        )
        .innerHTML =
        `
            <tr>
                ${configuracao
            .colunas
            .map(
                function (coluna) {

                    return (
                        `<th>${coluna}</th>`
                    );

                }
            )
            .join("")
        }
            </tr>
        `;


    const todos =
        dadosFiltrados();


    const quantidadePaginas =
        Math.ceil(
            todos.length /
            POR_PAGINA
        );


    if (
        quantidadePaginas > 0 &&
        paginaAtual > quantidadePaginas
    ) {

        paginaAtual =
            quantidadePaginas;

    }


    if (
        quantidadePaginas === 0
    ) {

        paginaAtual = 1;

    }


    const inicio =
        (paginaAtual - 1) *
        POR_PAGINA;


    const itens =
        todos.slice(
            inicio,
            inicio + POR_PAGINA
        );


    const corpo =
        document.getElementById(
            "corpoLista"
        );


    corpo.innerHTML =
        itens
            .map(
                function (registro) {

                    if (
                        tipoAtual ===
                        "toalha"
                    ) {

                        return `
                            <tr>

                                <td>
                                    ${String(
                            registro.id
                        ).padStart(
                            3,
                            "0"
                        )
                            }
                                </td>

                                <td>
                                    ${escapeHtml(
                                registro.codigo
                            )
                            }
                                </td>

                                <td>
                                    ${escapeHtml(
                                registro.status
                            )
                            }
                                </td>

                                <td class="actions-cell">

                                    <button
                                        class="edit-btn"
                                        data-editar="${registro.id}"
                                    >
                                        Editar
                                    </button>

                                    <button
                                        class="delete-btn"
                                        data-excluir="${registro.id}"
                                        aria-label="Excluir"
                                        title="Excluir"
                                    >
                                        🗑
                                    </button>

                                </td>

                            </tr>
                        `;

                    }


                    return `
                        <tr>

                            <td>
                                ${String(
                        registro.id
                    ).padStart(
                        3,
                        "0"
                    )
                        }
                            </td>

                            <td>
                                ${escapeHtml(
                            registro.nome
                        )
                        }
                            </td>

                            <td>
                                ${escapeHtml(
                            registro.cpf
                        )
                        }
                            </td>

                            <td>
                                ${escapeHtml(
                            registro.telefone
                        )
                        }
                            </td>

                            <td>
                                ${escapeHtml(
                            registro.email
                        )
                        }
                            </td>

                            <td class="actions-cell">

                                <button
                                    class="edit-btn"
                                    data-editar="${registro.id}"
                                >
                                    Editar
                                </button>

                                <button
                                    class="delete-btn"
                                    data-excluir="${registro.id}"
                                    aria-label="Excluir"
                                    title="Excluir"
                                >
                                    🗑
                                </button>

                            </td>

                        </tr>
                    `;

                }
            )
            .join("");


    document
        .getElementById(
            "listaVazia"
        )
        .hidden =
        todos.length !== 0;


    document
        .querySelector(
            ".table-wrap"
        )
        .hidden =
        todos.length === 0;


    if (
        todos.length > 0
    ) {

        const final =
            Math.min(
                inicio +
                POR_PAGINA,
                todos.length
            );


        const palavraRegistro =
            todos.length === 1
                ? "registro"
                : "registros";


        document
            .getElementById(
                "resumoLista"
            )
            .textContent =
            `Mostrando ${inicio + 1}-${final} de ${todos.length} ${palavraRegistro}`;

    } else {

        document
            .getElementById(
                "resumoLista"
            )
            .textContent = "";

    }


    renderizarPaginacao(
        quantidadePaginas
    );


    corpo
        .querySelectorAll(
            "[data-editar]"
        )
        .forEach(
            function (botao) {

                botao.addEventListener(
                    "click",
                    function () {

                        abrirEdicao(
                            Number(
                                botao.dataset.editar
                            )
                        );

                    }
                );

            }
        );


    corpo
        .querySelectorAll(
            "[data-excluir]"
        )
        .forEach(
            function (botao) {

                botao.addEventListener(
                    "click",
                    function () {

                        exclusaoAtual =
                            Number(
                                botao.dataset.excluir
                            );


                        abrirModal(
                            modalConfirmacao
                        );

                    }
                );

            }
        );

}


/* PAGINAÇÃO */

function renderizarPaginacao(
    totalPaginas
) {

    const paginacao =
        document.getElementById(
            "paginacaoLista"
        );


    if (
        totalPaginas === 0
    ) {

        paginacao.innerHTML = "";

        return;

    }


    let html = "";


    html += `
        <button
            type="button"
            data-pag="prev"
            ${paginaAtual === 1 ? "disabled" : ""}
            aria-label="Página anterior"
        >
            ‹
        </button>
    `;


    for (
        let pagina = 1;
        pagina <= totalPaginas;
        pagina++
    ) {

        html += `
            <button
                type="button"
                data-pag="${pagina}"
                class="${pagina === paginaAtual ? "active" : ""}"
            >
                ${pagina}
            </button>
        `;

    }


    html += `
        <button
            type="button"
            data-pag="next"
            ${paginaAtual === totalPaginas ? "disabled" : ""}
            aria-label="Próxima página"
        >
            ›
        </button>
    `;


    paginacao.innerHTML =
        html;


    paginacao
        .querySelectorAll(
            "button"
        )
        .forEach(
            function (botao) {

                botao.addEventListener(
                    "click",
                    function () {

                        if (
                            botao.disabled
                        ) {

                            return;

                        }


                        const destino =
                            botao.dataset.pag;


                        if (
                            destino === "prev"
                        ) {

                            paginaAtual--;

                        } else if (
                            destino === "next"
                        ) {

                            paginaAtual++;

                        } else {

                            paginaAtual =
                                Number(
                                    destino
                                );

                        }


                        renderizarLista();

                    }
                );

            }
        );

}


/* EDIÇÃO */

function abrirEdicao(id) {

    const registros =
        carregar(
            tipoAtual
        );


    const registro =
        registros.find(
            function (item) {

                return (
                    Number(
                        item.id
                    ) === id
                );

            }
        );


    if (!registro) {
        return;
    }


    edicaoAtual = id;


    document
        .getElementById(
            "edicaoId"
        )
        .textContent =
        String(id)
            .padStart(
                3,
                "0"
            );


    if (
        tipoAtual === "toalha"
    ) {

        document
            .getElementById(
                "tituloEdicao"
            )
            .textContent =
            "Editar toalha";


        document
            .getElementById(
                "camposEdicao"
            )
            .innerHTML = `

                <div class="edit-field">

                    <label for="editCodigo">
                        Código da toalha
                    </label>

                    <input
                        id="editCodigo"
                        type="text"
                        required
                        value="${escapeHtml(registro.codigo)}"
                    >

                </div>


                <div class="status-info">

                    Status:

                    <strong>
                        ${escapeHtml(registro.status)}
                    </strong>

                </div>

            `;

    } else {

        document
            .getElementById(
                "tituloEdicao"
            )
            .textContent =
            tipoAtual === "nadador"
                ? "Editar nadador"
                : "Editar funcionário";


        document
            .getElementById(
                "camposEdicao"
            )
            .innerHTML = `

                <div class="edit-field">

                    <label for="editNome">
                        Nome
                    </label>

                    <input
                        id="editNome"
                        type="text"
                        required
                        value="${escapeHtml(registro.nome)}"
                    >

                </div>


                <div class="edit-field">

                    <label for="editCpf">
                        CPF
                    </label>

                    <input
                        id="editCpf"
                        type="text"
                        required
                        value="${escapeHtml(registro.cpf)}"
                    >

                </div>


                <div class="edit-field">

                    <label for="editEmail">
                        E-mail
                    </label>

                    <input
                        id="editEmail"
                        type="email"
                        required
                        value="${escapeHtml(registro.email)}"
                    >

                </div>


                <div class="edit-field">

                    <label for="editTelefone">
                        Telefone
                    </label>

                    <input
                        id="editTelefone"
                        type="text"
                        required
                        value="${escapeHtml(registro.telefone)}"
                    >

                </div>

            `;

    }


    abrirModal(
        modalEdicao
    );

}

/* SALVAR EDIÇÃO */


document
    .getElementById(
        "formEdicao"
    )
    .addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const registros =
                carregar(
                    tipoAtual
                );


            const indice =
                registros.findIndex(
                    function (registro) {

                        return (
                            Number(
                                registro.id
                            ) ===
                            edicaoAtual
                        );

                    }
                );


            if (
                indice < 0
            ) {

                return;

            }


            if (
                tipoAtual === "toalha"
            ) {

                const codigo =
                    document
                        .getElementById(
                            "editCodigo"
                        )
                        .value
                        .trim();


                if (!codigo) {
                    return;
                }


                const codigoJaExiste =
                    registros.some(
                        function (
                            toalha,
                            posicao
                        ) {

                            return (
                                posicao !== indice &&
                                normalizar(
                                    toalha.codigo
                                ) ===
                                normalizar(
                                    codigo
                                )
                            );

                        }
                    );


                if (
                    codigoJaExiste
                ) {

                    alert(
                        "Já existe uma toalha com esse código identificador."
                    );

                    return;

                }


                registros[indice] = {

                    ...registros[indice],

                    codigo:
                        codigo

                };

            } else {

                const nome =
                    document
                        .getElementById(
                            "editNome"
                        )
                        .value
                        .trim();


                const cpf =
                    document
                        .getElementById(
                            "editCpf"
                        )
                        .value
                        .trim();


                const email =
                    document
                        .getElementById(
                            "editEmail"
                        )
                        .value
                        .trim();


                const telefone =
                    document
                        .getElementById(
                            "editTelefone"
                        )
                        .value
                        .trim();


                if (
                    !nome ||
                    !cpf ||
                    !email ||
                    !telefone
                ) {

                    return;

                }


                registros[indice] = {

                    ...registros[indice],

                    nome:
                        nome,

                    cpf:
                        cpf,

                    email:
                        email,

                    telefone:
                        telefone

                };

            }


            salvar(
                tipoAtual,
                registros
            );


            fecharModal(
                modalEdicao
            );


            renderizarLista();

        }
    );


/* EXCLUSÃO */

document
    .getElementById(
        "confirmarExclusao"
    )
    .addEventListener(
        "click",
        function () {

            const registros =
                carregar(
                    tipoAtual
                );


            const registrosAtualizados =
                registros.filter(
                    function (registro) {

                        return (
                            Number(
                                registro.id
                            ) !==
                            exclusaoAtual
                        );

                    }
                );


            salvar(
                tipoAtual,
                registrosAtualizados
            );


            exclusaoAtual = null;


            fecharModal(
                modalConfirmacao
            );


            renderizarLista();

        }
    );