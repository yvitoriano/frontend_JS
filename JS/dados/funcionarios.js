import { Funcionario } from "../classes/funcionario.js";

const STORAGE = "funcionarios";

export function carregarFuncionarios() {

    try {

        const dados = JSON.parse(
            localStorage.getItem(STORAGE)
        ) || [];

        return dados.map(funcionario =>
            new Funcionario(
                funcionario.id,
                funcionario.nome,
                funcionario.cpf,
                funcionario.telefone,
                funcionario.email
            )
        );

    } catch (erro) {

        return [];

    }

}

export function salvarFuncionarios(funcionarios) {

    localStorage.setItem(
        STORAGE,
        JSON.stringify(funcionarios)
    );

}