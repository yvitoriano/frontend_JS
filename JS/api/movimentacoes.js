import { requisicao } from "./http.js";
const RECURSO = "/movimentacoes";
const idValido = id => {
    if (id === undefined || id === null || String(id).trim() === "") throw new TypeError("Informe um ID válido.");
    return encodeURIComponent(String(id));
};

function normalizar(item) {
    return {
        ...item,
        id: item.id ?? item.id_movimentacao,
        tipo: item.tipo || (item.data_hora_devolucao ? "Devolução" : "Retirada"),
        dataHora: item.data_hora_devolucao || item.dataHora || item.data_hora_retirada,
        funcionarioId: item.funcionarioId ?? item.id_funcionario,
        nadadorId: item.nadadorId ?? item.id_nadador,
        toalhaId: item.toalhaId ?? item.id_toalha
    };
}
export async function listarMovimentacoes() { return (await requisicao(RECURSO)).map(normalizar); }
export async function buscarMovimentacao(id) { return normalizar(await requisicao(`${RECURSO}/${idValido(id)}`)); }
export async function cadastrarMovimentacao(dados) {
    const registro = {
        id_funcionario: Number(dados.funcionarioId ?? dados.funcionario?.id),
        id_nadador: Number(dados.nadadorId ?? dados.nadador?.id),
        id_toalha: Number(dados.toalhaId ?? dados.toalha?.id),
        ...(dados.dataHora ? { dataHora: dados.dataHora } : {})
    };
    return normalizar(await requisicao(RECURSO, { method: "POST", body: registro }));
}
export async function devolverMovimentacaoPorToalha(idToalha, dataHora) {
    return normalizar(await requisicao(`/toalhas/${idValido(idToalha)}/devolucao`, { method: "PUT", body: dataHora ? { dataHora } : {} }));
}
export async function devolverMovimentacao(id, dataHora) {
    return normalizar(await requisicao(`${RECURSO}/${idValido(id)}/devolucao`, { method: "PUT", body: dataHora ? { dataHora } : {} }));
}
export async function listarMovimentacoesComRelacionamentos() { return listarMovimentacoes(); }
