import { requisicao } from "./http.js";
const RECURSO = "/nadadores";
const idValido = id => {
    if (id === undefined || id === null || String(id).trim() === "") throw new TypeError("Informe um ID válido.");
    return encodeURIComponent(String(id));
};
export const listarNadadores = () => requisicao(RECURSO);
export const buscarNadador = id => requisicao(`${RECURSO}/${idValido(id)}`);
export const cadastrarNadador = dados => requisicao(RECURSO, { method: "POST", body: dados });
export const atualizarNadador = (id, dados) => requisicao(`${RECURSO}/${idValido(id)}`, { method: "PATCH", body: dados });
export const excluirNadador = id => requisicao(`${RECURSO}/${idValido(id)}`, { method: "DELETE" });
