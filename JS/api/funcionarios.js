// Nado Livre v.5 - recurso funcionarios
// Depende de requisicao(caminho, opcoes) definida por Sarah em ./http.js.
// O body deve ser um OBJETO JS; http.js faz JSON.stringify e trata os erros.
import { requisicao } from "./http.js";

const RECURSO = "/funcionarios";

export function listarFuncionarios() {
    return requisicao(RECURSO);
}

export function buscarFuncionario(id) {
    return requisicao(`${RECURSO}/${encodeURIComponent(String(id))}`);
}

export function cadastrarFuncionario(dados) {
    // Nao enviar id: o JSON Server gera uma string automaticamente.
    return requisicao(RECURSO, { method: "POST", body: dados });
}

export function atualizarFuncionario(id, dados) {
    return requisicao(`${RECURSO}/${encodeURIComponent(String(id))}`, {
        method: "PATCH",
        body: dados
    });
}

export function excluirFuncionario(id) {
    return requisicao(`${RECURSO}/${encodeURIComponent(String(id))}`, {
        method: "DELETE"
    });
}
