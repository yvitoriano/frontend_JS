const STORAGE = {
    toalhas: "toalhas",
    movimentacoes: "movimentacoes"
};

const POR_PAGINA = 10;

let paginaAtual = 1;



const listaToalhas =
    document.getElementById("listaToalhas");

const mensagemVazia =
    document.getElementById("mensagemVazia");

const filtroStatus =
    document.getElementById("filtroStatus");

const btnAtualizar =
    document.getElementById("btnAtualizar");

const totalToalhas =
    document.getElementById("totalToalhas");

const totalDisponiveis =
    document.getElementById("totalDisponiveis");

const totalEmUso =
    document.getElementById("totalEmUso");

const totalNaoDevolvidas =
    document.getElementById("totalNaoDevolvidas");

const paginacao =
    document.getElementById("paginacao");

const resumoPaginacao =
    document.getElementById("resumoPaginacao");



function carregarDados(chave) {

    try {

        const dados =
            JSON.parse(
                localStorage.getItem(chave)
            );

        return Array.isArray(dados)
            ? dados
            : [];

    } catch (erro) {

        console.error(
            "Erro ao carregar dados:",
            erro
        );

        return [];

    }

}



function formatarId(id) {

    return String(id).padStart(
        2,
        "0"
    );

}


function formatarData(data) {

    if (!data) {
        return "—";
    }


    const valor =
        new Date(data);


    if (
        Number.isNaN(
            valor.getTime()
        )
    ) {

        return data;

    }


    return valor.toLocaleString(
        "pt-BR",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}



function buscarUltimaMovimentacao(
    toalha,
    movimentacoes
) {

    const registros =
        movimentacoes.filter(
            function (movimentacao) {

                return (
                    String(
                        movimentacao.toalhaId
                    ) ===
                    String(
                        toalha.id
                    )
                );

            }
        );


    if (registros.length === 0) {

        return null;

    }


    registros.sort(
        function (a, b) {

            return (
                new Date(b.dataHora) -
                new Date(a.dataHora)
            );

        }
    );


    return registros[0];

}



function obterObservacao(
    toalha,
    ultimaMovimentacao
) {

    if (
        toalha.status ===
        "Disponível"
    ) {

        return "Pronta para uso";

    }


    if (
        toalha.status ===
        "Em uso"
    ) {

        if (
            ultimaMovimentacao &&
            ultimaMovimentacao.nadadorNome
        ) {

            return (
                "Retirada por " +
                ultimaMovimentacao.nadadorNome
            );

        }


        return "Retirada por nadador";

    }


    if (
        toalha.status ===
        "Não devolvida"
    ) {

        return "Aguardando devolução";

    }


    return "—";

}



function criarStatus(status) {

    let classe =
        "status-disponivel";

    let icone =
        "✓";


    if (
        status ===
        "Em uso"
    ) {

        classe =
            "status-em-uso";

        icone =
            "◷";

    }


    if (
        status ===
        "Não devolvida"
    ) {

        classe =
            "status-nao-devolvida";

        icone =
            "!";

    }


    return `
        <span class="status ${classe}">
            <span class="status-icone">
                ${icone}
            </span>

            ${status}
        </span>
    `;

}


function atualizarLista() {

    const toalhas =
        carregarDados(
            STORAGE.toalhas
        );


    const movimentacoes =
        carregarDados(
            STORAGE.movimentacoes
        );


    const filtro =
        filtroStatus.value;


    const toalhasFiltradas =
        toalhas.filter(
            function (toalha) {

                return (
                    filtro === "Todas" ||
                    toalha.status === filtro
                );

            }
        );


    const totalPaginas =
        Math.max(
            1,
            Math.ceil(
                toalhasFiltradas.length /
                POR_PAGINA
            )
        );


    if (
        paginaAtual >
        totalPaginas
    ) {

        paginaAtual =
            totalPaginas;

    }


    const inicio =
        (paginaAtual - 1) *
        POR_PAGINA;


    const fim =
        inicio +
        POR_PAGINA;


    const registrosPagina =
        toalhasFiltradas.slice(
            inicio,
            fim
        );


    listaToalhas.innerHTML =
        "";


    if (
        toalhasFiltradas.length === 0
    ) {

        mensagemVazia.style.display =
            "block";

    } else {

        mensagemVazia.style.display =
            "none";

    }


    registrosPagina.forEach(
        function (toalha) {

            const ultimaMovimentacao =
                buscarUltimaMovimentacao(
                    toalha,
                    movimentacoes
                );


            const linha =
                document.createElement(
                    "tr"
                );


            linha.innerHTML = `
                <td>
                    ${formatarId(toalha.id)}
                </td>

                <td class="codigo">
                    ${toalha.codigo || "—"}
                </td>

                <td>
                    ${criarStatus(
                toalha.status ||
                "Disponível"
            )}
                </td>

                <td>
                    ${ultimaMovimentacao
                    ? formatarData(
                        ultimaMovimentacao.dataHora
                    )
                    : "—"
                }
                </td>

                <td>
                    ${obterObservacao(
                    toalha,
                    ultimaMovimentacao
                )}
                </td>
            `;


            listaToalhas.appendChild(
                linha
            );

        }
    );


    atualizarResumo(
        toalhas
    );


    atualizarPaginacao(
        toalhasFiltradas.length,
        totalPaginas
    );

}



function atualizarResumo(toalhas) {

    const disponiveis =
        toalhas.filter(
            function (toalha) {

                return (
                    toalha.status ===
                    "Disponível"
                );

            }
        ).length;


    const emUso =
        toalhas.filter(
            function (toalha) {

                return (
                    toalha.status ===
                    "Em uso"
                );

            }
        ).length;


    const naoDevolvidas =
        toalhas.filter(
            function (toalha) {

                return (
                    toalha.status ===
                    "Não devolvida"
                );

            }
        ).length;


    totalToalhas.textContent =
        toalhas.length;


    totalDisponiveis.textContent =
        disponiveis;


    totalEmUso.textContent =
        emUso;


    totalNaoDevolvidas.textContent =
        naoDevolvidas;

}



function atualizarPaginacao(
    quantidade,
    totalPaginas
) {

    paginacao.innerHTML =
        "";


    if (
        quantidade === 0
    ) {

        resumoPaginacao.textContent =
            "Mostrando 0 de 0 registros";

        return;

    }


    const inicio =
        (paginaAtual - 1) *
        POR_PAGINA +
        1;


    const fim =
        Math.min(
            paginaAtual *
            POR_PAGINA,
            quantidade
        );


    resumoPaginacao.textContent =
        `Mostrando ${inicio}-${fim} de ${quantidade} registros`;


    const anterior =
        document.createElement(
            "button"
        );


    anterior.type =
        "button";


    anterior.textContent =
        "<";


    anterior.disabled =
        paginaAtual === 1;


    anterior.addEventListener(
        "click",
        function () {

            if (
                paginaAtual > 1
            ) {

                paginaAtual--;

                atualizarLista();

            }

        }
    );


    paginacao.appendChild(
        anterior
    );


    for (
        let pagina = 1;
        pagina <= totalPaginas;
        pagina++
    ) {

        const botao =
            document.createElement(
                "button"
            );


        botao.type =
            "button";


        botao.textContent =
            pagina;


        if (
            pagina ===
            paginaAtual
        ) {

            botao.classList.add(
                "ativo"
            );

        }


        botao.addEventListener(
            "click",
            function () {

                paginaAtual =
                    pagina;

                atualizarLista();

            }
        );


        paginacao.appendChild(
            botao
        );

    }


    const proximo =
        document.createElement(
            "button"
        );


    proximo.type =
        "button";


    proximo.textContent =
        ">";


    proximo.disabled =
        paginaAtual ===
        totalPaginas;


    proximo.addEventListener(
        "click",
        function () {

            if (
                paginaAtual <
                totalPaginas
            ) {

                paginaAtual++;

                atualizarLista();

            }

        }
    );


    paginacao.appendChild(
        proximo
    );

}


filtroStatus.addEventListener(
    "change",
    function () {

        paginaAtual =
            1;

        atualizarLista();

    }
);


btnAtualizar.addEventListener(
    "click",
    function () {

        atualizarLista();

    }
);


/*VOLTAR PARA A PÁGINA*/

window.addEventListener(
    "pageshow",
    function () {

        atualizarLista();

    }
);


/*ALTERAÇÕES NO LOCAL STORAGE*/

window.addEventListener(
    "storage",
    function (event) {

        if (
            event.key ===
            STORAGE.toalhas ||
            event.key ===
            STORAGE.movimentacoes
        ) {

            atualizarLista();

        }

    }
);


atualizarLista();