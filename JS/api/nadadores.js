// Nado Livre v.5 - recurso nadadores
// Depende de requisicao(caminho, opcoes) definida por Sarah em ./http.js.
// O body deve ser um OBJETO JS; http.js faz JSON.stringify e trata os erros.
import { requisicao } from "./http.js";

const RECURSO = "/nadadores";

export function listarNadadores() {
    return requisicao(RECURSO);
}

export function buscarNadador(id) {
    return requisicao(`${RECURSO}/${encodeURIComponent(String(id))}`);
}

export function cadastrarNadador(dados) {
    // Nao enviar id: o JSON Server gera uma string automaticamente.
    return requisicao(RECURSO, { method: "POST", body: dados });
}

export function atualizarNadador(id, dados) {
    return requisicao(`${RECURSO}/${encodeURIComponent(String(id))}`, {
        method: "PATCH",
        body: dados
    });
}

export function excluirNadador(id) {
    return requisicao(`${RECURSO}/${encodeURIComponent(String(id))}`, {
        method: "DELETE"
    });
}
