import { Nadador } from "../classes/nadador.js";

const STORAGE = "nadadores";

export function carregarNadadores() {

    try {

        const dados = JSON.parse(
            localStorage.getItem(STORAGE)
        ) || [];

        return dados.map(nadador =>
            new Nadador(
                nadador.id,
                nadador.nome,
                nadador.cpf,
                nadador.telefone,
                nadador.email
            )
        );

    } catch (erro) {

        return [];

    }

}

export function salvarNadadores(nadadores) {

    localStorage.setItem(
        STORAGE,
        JSON.stringify(nadadores)
    );

}