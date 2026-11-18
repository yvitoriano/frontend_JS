import { requisicao } from "./http.js";
const RECURSO = "/funcionarios";
const idValido = id => {
    if (id === undefined || id === null || String(id).trim() === "") throw new TypeError("Informe um ID válido.");
    return encodeURIComponent(String(id));
};
export const listarFuncionarios = () => requisicao(RECURSO);
export const buscarFuncionario = id => requisicao(`${RECURSO}/${idValido(id)}`);
export const cadastrarFuncionario = dados => requisicao(RECURSO, { method: "POST", body: dados });
export const atualizarFuncionario = (id, dados) => requisicao(`${RECURSO}/${idValido(id)}`, { method: "PATCH", body: dados });
export const excluirFuncionario = id => requisicao(`${RECURSO}/${idValido(id)}`, { method: "DELETE" });
