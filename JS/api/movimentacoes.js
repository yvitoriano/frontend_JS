// Nado Livre v.5 — operações do recurso movimentacoes.
// Os relacionamentos são persistidos por ID; nomes e códigos são mantidos
// como retrato dos dados no momento da movimentação.
import { requisicao } from "./http.js";

const RECURSO = "/movimentacoes";

function normalizarId(id) {
    if (id === undefined || id === null || String(id).trim() === "") {
        throw new TypeError("É necessário informar um identificador válido.");
    }
    return encodeURIComponent(String(id));
}

function serializarMovimentacao(dados) {
    const origem = typeof dados.toJSON === "function" ? dados.toJSON() : dados;

    const toalha = origem.toalha ?? null;
    const funcionario = origem.funcionario ?? null;
    const nadador = origem.nadador ?? null;

    return {
        ...(origem.id !== undefined ? { id: String(origem.id) } : {}),
        tipo: origem.tipo,
        toalhaId: origem.toalhaId ?? toalha?.id ?? null,
        toalhaCodigo: origem.toalhaCodigo ?? toalha?.codigo ?? null,
        funcionarioId: origem.funcionarioId ?? funcionario?.id ?? null,
        funcionarioNome: origem.funcionarioNome ?? funcionario?.nome ?? null,
        nadadorId: origem.nadadorId ?? nadador?.id ?? null,
        nadadorNome: origem.nadadorNome ?? nadador?.nome ?? null,
        dataHora: origem.dataHora
    };
}

export function listarMovimentacoes() {
    return requisicao(RECURSO);
}

export function buscarMovimentacao(id) {
    return requisicao(`${RECURSO}/${normalizarId(id)}`);
}

export function cadastrarMovimentacao(dados) {
    const registro = serializarMovimentacao(dados);
    delete registro.id; // O JSON Server gera o identificador.
    return requisicao(RECURSO, { method: "POST", body: registro });
}

export function atualizarMovimentacao(id, dados) {
    const registro = serializarMovimentacao(dados);
    delete registro.id;
    return requisicao(`${RECURSO}/${normalizarId(id)}`, {
        method: "PATCH",
        body: registro
    });
}

export function substituirMovimentacao(id, dados) {
    const registro = serializarMovimentacao(dados);
    registro.id = String(id);
    return requisicao(`${RECURSO}/${normalizarId(id)}`, {
        method: "PUT",
        body: registro
    });
}

export function excluirMovimentacao(id) {
    return requisicao(`${RECURSO}/${normalizarId(id)}`, {
        method: "DELETE"
    });
}

/**
 * Retorna movimentações com os objetos relacionados hidratados.
 * Útil para telas que utilizam a classe Movimentacao e seus getters.
 */
export async function listarMovimentacoesComRelacionamentos() {
    const [movimentacoes, toalhas, funcionarios, nadadores] = await Promise.all([
        requisicao(RECURSO),
        requisicao("/toalhas"),
        requisicao("/funcionarios"),
        requisicao("/nadadores")
    ]);

    return movimentacoes.map((movimentacao) => {
        const toalha = toalhas.find(
            item => String(item.id) === String(movimentacao.toalhaId)
        ) ?? null;
        const funcionario = funcionarios.find(
            item => String(item.id) === String(movimentacao.funcionarioId)
        ) ?? null;
        const nadador = nadadores.find(
            item => String(item.id) === String(movimentacao.nadadorId)
        ) ?? null;

        return {
            ...movimentacao,
            toalha,
            funcionario,
            nadador
        };
    });
}
