const STORAGE = "funcionarios";

export function carregarFuncionarios() {

    try {

        return JSON.parse(
            localStorage.getItem(STORAGE)
        ) || [];

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