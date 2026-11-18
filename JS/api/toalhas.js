import { requisicao } from "./http.js";
const RECURSO = "/toalhas";
const idValido = id => {
    if (id === undefined || id === null || String(id).trim() === "") throw new TypeError("Informe um ID válido.");
    return encodeURIComponent(String(id));
};
const normalizar = toalha => toalha ? ({ ...toalha, id: toalha.id ?? toalha.id_toalha, status: toalha.status === "em_uso" ? "Em uso" : (toalha.status === "disponivel" ? "Disponível" : toalha.status) }) : toalha;
const normalizarLista = lista => lista.map(normalizar);
export async function listarToalhas() { return normalizarLista(await requisicao(RECURSO)); }
export async function buscarToalha(id) { return normalizar(await requisicao(`${RECURSO}/${idValido(id)}`)); }
export async function cadastrarToalha(dados) { return normalizar(await requisicao(RECURSO, { method: "POST", body: { codigo: dados.codigo } })); }
export async function atualizarToalha(id, dados) { return normalizar(await requisicao(`${RECURSO}/${idValido(id)}`, { method: "PATCH", body: dados })); }
export async function substituirToalha(id, dados) { return atualizarToalha(id, dados); }
export const excluirToalha = id => requisicao(`${RECURSO}/${idValido(id)}`, { method: "DELETE" });
