// Nado Livre v.5 — operações do recurso toalhas.
import { requisicao } from "./http.js";

const RECURSO = "/toalhas";

function normalizarId(id) {
    if (id === undefined || id === null || String(id).trim() === "") {
        throw new TypeError("É necessário informar um identificador válido.");
    }
    return encodeURIComponent(String(id));
}

export function listarToalhas() {
    return requisicao(RECURSO);
}

export function buscarToalha(id) {
    return requisicao(`${RECURSO}/${normalizarId(id)}`);
}

export function cadastrarToalha(dados) {
    const { id, ...novoRegistro } = dados;
    return requisicao(RECURSO, { method: "POST", body: novoRegistro });
}

export function atualizarToalha(id, dados) {
    return requisicao(`${RECURSO}/${normalizarId(id)}`, {
        method: "PATCH",
        body: dados
    });
}

export function substituirToalha(id, dados) {
    return requisicao(`${RECURSO}/${normalizarId(id)}`, {
        method: "PUT",
        body: { ...dados, id: String(id) }
    });
}

export function excluirToalha(id) {
    return requisicao(`${RECURSO}/${normalizarId(id)}`, {
        method: "DELETE"
    });
}
