// Nado Livre v.5 - recurso nadadores
// Usa requisicao(caminho, opcoes) de ./http.js.
// O body deve ser um OBJETO JS; http.js faz JSON.stringify e trata os erros.
import { requisicao } from "./http.js";

const RECURSO = "/nadadores";

function normalizarId(id) {
    if (id === undefined || id === null || String(id).trim() === "") {
        throw new TypeError("É necessário informar um identificador válido.");
    }
    return encodeURIComponent(String(id));
}

export function listarNadadores() {
    return requisicao(RECURSO);
}

export function buscarNadador(id) {
    return requisicao(`${RECURSO}/${normalizarId(id)}`);
}

export function cadastrarNadador(dados) {
    // Não enviar id: o JSON Server gera uma string automaticamente.
    const { id, ...novoRegistro } = dados;
    return requisicao(RECURSO, { method: "POST", body: novoRegistro });
}

export function atualizarNadador(id, dados) {
    // O id da URL é a fonte de verdade; nunca sobrescrever o id no corpo.
    const { id: _ignorado, ...alteracoes } = dados;
    return requisicao(`${RECURSO}/${normalizarId(id)}`, {
        method: "PATCH",
        body: alteracoes
    });
}

export function excluirNadador(id) {
    return requisicao(`${RECURSO}/${normalizarId(id)}`, {
        method: "DELETE"
    });
}
