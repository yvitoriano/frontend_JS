import {
    carregarToalhas
} from "../dados/toalhas.js";

import {
    carregarMovimentacoes
} from "../dados/movimentacoes.js";

import {
    criarCelulaTabela,
    criarStatusToalha,
    criarBotaoPaginacao
} from "./componentes.js";


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


function formatarId(id) {
    return String(id).padStart(2, "0");
}


function formatarData(data) {
    if (!data) {
        return "—";
    }

    const valor = new Date(data);

    if (Number.isNaN(valor.getTime())) {
        return data;
    }

    return valor.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}


function buscarUltimaMovimentacao(toalha, movimentacoes) {
    const registros = movimentacoes.filter(
        function (movimentacao) {
            return String(movimentacao.toalhaId) === String(toalha.id);
        }
    );

    if (registros.length === 0) {
        return null;
    }

    registros.sort(
        function (a, b) {
            return new Date(b.dataHora) - new Date(a.dataHora);
        }
    );

    return registros[0];
}


function obterObservacao(toalha, ultimaMovimentacao) {
    if (toalha.status === "Disponível") {
        return "Pronta para uso";
    }

    if (toalha.status === "Em uso") {
        if (ultimaMovimentacao && ultimaMovimentacao.nadadorNome) {
            return "Retirada por " + ultimaMovimentacao.nadadorNome;
        }

        return "Retirada por nadador";
    }

    if (toalha.status === "Não devolvida") {
        return "Aguardando devolução";
    }

    return "—";
}


function atualizarLista() {
    const toalhas = carregarToalhas();
    const movimentacoes = carregarMovimentacoes();
    const filtro = filtroStatus.value;

    const toalhasFiltradas = toalhas.filter(
        function (toalha) {
            return filtro === "Todas" || toalha.status === filtro;
        }
    );

    const totalPaginas = Math.max(
        1,
        Math.ceil(toalhasFiltradas.length / POR_PAGINA)
    );

    if (paginaAtual > totalPaginas) {
        paginaAtual = totalPaginas;
    }

    const inicio = (paginaAtual - 1) * POR_PAGINA;
    const fim = inicio + POR_PAGINA;

    const registrosPagina = toalhasFiltradas.slice(inicio, fim);

    listaToalhas.replaceChildren();

    if (toalhasFiltradas.length === 0) {
        mensagemVazia.style.display = "block";
    } else {
        mensagemVazia.style.display = "none";
    }

    registrosPagina.forEach(function (toalha) {
        const ultimaMovimentacao = buscarUltimaMovimentacao(
            toalha,
            movimentacoes
        );

        const linha = document.createElement("tr");

        const celulaId = criarCelulaTabela(
            formatarId(toalha.id)
        );

        const celulaCodigo = criarCelulaTabela(
            toalha.codigo || "—",
            "codigo"
        );

        const celulaStatus = document.createElement("td");

        celulaStatus.appendChild(
            criarStatusToalha(toalha.status || "Disponível")
        );

        const celulaData = criarCelulaTabela(
            ultimaMovimentacao
                ? formatarData(ultimaMovimentacao.dataHora)
                : "—"
        );

        const celulaObservacao = criarCelulaTabela(
            obterObservacao(toalha, ultimaMovimentacao)
        );

        linha.append(
            celulaId,
            celulaCodigo,
            celulaStatus,
            celulaData,
            celulaObservacao
        );

        listaToalhas.appendChild(linha);
    });

    atualizarResumo(toalhas);

    atualizarPaginacao(
        toalhasFiltradas.length,
        totalPaginas
    );
}


function atualizarResumo(toalhas) {
    const disponiveis = toalhas.filter(
        function (toalha) {
            return toalha.status === "Disponível";
        }
    ).length;

    const emUso = toalhas.filter(
        function (toalha) {
            return toalha.status === "Em uso";
        }
    ).length;

    const naoDevolvidas = toalhas.filter(
        function (toalha) {
            return toalha.status === "Não devolvida";
        }
    ).length;

    totalToalhas.textContent = toalhas.length;
    totalDisponiveis.textContent = disponiveis;
    totalEmUso.textContent = emUso;
    totalNaoDevolvidas.textContent = naoDevolvidas;
}


function atualizarPaginacao(quantidade, totalPaginas) {
    paginacao.replaceChildren();

    if (quantidade === 0) {
        resumoPaginacao.textContent = "Mostrando 0 de 0 registros";
        return;
    }

    const inicio = (paginaAtual - 1) * POR_PAGINA + 1;
    const fim = Math.min(paginaAtual * POR_PAGINA, quantidade);

    resumoPaginacao.textContent =
        `Mostrando ${inicio}-${fim} de ${quantidade} registros`;

    paginacao.appendChild(
        criarBotaoPaginacao(
            "<",
            function () {
                if (paginaAtual > 1) {
                    paginaAtual--;
                    atualizarLista();
                }
            },
            paginaAtual === 1
        )
    );

    for (let pagina = 1; pagina <= totalPaginas; pagina++) {
        paginacao.appendChild(
            criarBotaoPaginacao(
                pagina,
                function () {
                    paginaAtual = pagina;
                    atualizarLista();
                },
                false,
                pagina === paginaAtual
            )
        );
    }

    paginacao.appendChild(
        criarBotaoPaginacao(
            ">",
            function () {
                if (paginaAtual < totalPaginas) {
                    paginaAtual++;
                    atualizarLista();
                }
            },
            paginaAtual === totalPaginas
        )
    );
}


filtroStatus.addEventListener("change", function () {
    paginaAtual = 1;
    atualizarLista();
});


btnAtualizar.addEventListener("click", function () {
    atualizarLista();
});


window.addEventListener("pageshow", function () {
    atualizarLista();
});


window.addEventListener("storage", function (event) {
    if (
        event.key === "toalhas" ||
        event.key === "movimentacoes"
    ) {
        atualizarLista();
    }
});


atualizarLista();