

/* CLASSE */
class Toalha {
    constructor(id, codigoIdentificador, status, ultimaMovimentacao, observacao) {
        this.id = id;
        this.codigoIdentificador = codigoIdentificador;
        this.status = status;
        this.ultimaMovimentacao = ultimaMovimentacao;
        this.observacao = observacao;
    }
}


/* ARRAY DE TOALHAS
   Estes dados representam as toalhas já cadastradas.
   O cadastro é feito na página Cadastro. */
const toalhas = [
    new Toalha("01", "TOL-001", "Disponível", "22/05/2026 13:35", "Pronta para uso"),
    new Toalha("02", "TOL-002", "Em uso", "22/05/2026 14:35", "Retirada por nadador"),
    new Toalha("03", "TOL-003", "Disponível", "22/05/2026 16:35", "Pronta para uso"),
    new Toalha("04", "TOL-004", "Não devolvida", "22/05/2026 15:35", "Aguardando devolução"),
    new Toalha("05", "TOL-005", "Disponível", "22/05/2026 13:35", "Pronta para uso"),
    new Toalha("06", "TOL-006", "Em uso", "22/05/2026 13:35", "Retirada por nadador"),
    new Toalha("07", "TOL-007", "Disponível", "22/05/2026 09:35", "Pronta para uso"),
    new Toalha("08", "TOL-008", "Não devolvida", "22/05/2026 00:00", "Aguardando devolução"),
    new Toalha("09", "TOL-009", "Disponível", "22/05/2026 18:00", "Pronta para uso"),
    new Toalha("10", "TOL-010", "Em uso", "22/05/2026 18:50", "Retirada por nadador")
];


/* ELEMENTOS */
const listaToalhas = document.getElementById("listaToalhas");
const mensagemVazia = document.getElementById("mensagemVazia");
const filtroStatus = document.getElementById("filtroStatus");
const btnAtualizar = document.getElementById("btnAtualizar");
const totalToalhas = document.getElementById("totalToalhas");
const totalDisponiveis = document.getElementById("totalDisponiveis");
const totalEmUso = document.getElementById("totalEmUso");
const totalNaoDevolvidas = document.getElementById("totalNaoDevolvidas");


/* LISTAGEM */
function atualizarLista() {

    const filtro = filtroStatus.value;

    const toalhasFiltradas = toalhas.filter(function (toalha) {
        return filtro === "Todas" || toalha.status === filtro;
    });

    listaToalhas.innerHTML = "";

    if (toalhasFiltradas.length === 0) {
        mensagemVazia.style.display = "block";
    } else {
        mensagemVazia.style.display = "none";
    }

    toalhasFiltradas.forEach(function (toalha) {

        const linha = document.createElement("tr");

        let classeStatus = "";

        if (toalha.status === "Disponível") {
            classeStatus = "status-disponivel";
        } else if (toalha.status === "Em uso") {
            classeStatus = "status-em-uso";
        } else {
            classeStatus = "status-nao-devolvida";
        }

        linha.innerHTML = `
                    <td>${toalha.id}</td>
                    <td class="codigo">${toalha.codigoIdentificador}</td>
                    <td>
                        <button
                            type="button"
                            class="status ${classeStatus}"
                            onclick="alterarStatus('${toalha.id}')"
                            title="Clique para alterar a situação"
                        >
                            <span class="status-icone">
                                ${toalha.status === "Disponível" ? "✓" : toalha.status === "Em uso" ? "◷" : "!"}
                            </span>
                            ${toalha.status}
                        </button>
                    </td>
                    <td>${toalha.ultimaMovimentacao}</td>
                    <td>${toalha.observacao}</td>
                `;

        listaToalhas.appendChild(linha);
    });

    atualizarResumo();
}


/* RESUMO */
function atualizarResumo() {

    const disponiveis = toalhas.filter(function (toalha) {
        return toalha.status === "Disponível";
    }).length;

    const emUso = toalhas.filter(function (toalha) {
        return toalha.status === "Em uso";
    }).length;

    const naoDevolvidas = toalhas.filter(function (toalha) {
        return toalha.status === "Não devolvida";
    }).length;

    totalToalhas.textContent = toalhas.length;
    totalDisponiveis.textContent = disponiveis;
    totalEmUso.textContent = emUso;
    totalNaoDevolvidas.textContent = naoDevolvidas;
}


/* ALTERAÇÃO DA SITUAÇÃO */
function alterarStatus(id) {

    const toalha = toalhas.find(function (item) {
        return item.id === id;
    });

    if (!toalha) {
        return;
    }

    if (toalha.status === "Disponível") {
        toalha.status = "Em uso";
        toalha.observacao = "Retirada por nadador";
    } else if (toalha.status === "Em uso") {
        toalha.status = "Não devolvida";
        toalha.observacao = "Aguardando devolução";
    } else if (toalha.status === "Não devolvida") {
        toalha.status = "Disponível";
        toalha.observacao = "Pronta para uso";
    }

    atualizarLista();
}


/* FILTRO */
filtroStatus.addEventListener("change", atualizarLista);


/* ATUALIZAR */
btnAtualizar.addEventListener("click", function () {
    atualizarLista();
});


/* PRIMEIRA EXIBIÇÃO */
atualizarLista();
