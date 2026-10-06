import { Toalha } from "../classes/toalha.js";

const STORAGE = "toalhas";

export function carregarToalhas() {

    try {

        const dados = JSON.parse(
            localStorage.getItem(STORAGE)
        ) || [];

        return dados.map(toalha => {

            const novaToalha = new Toalha(
                toalha.id,
                toalha.codigo,
                toalha.status
            );

            if (toalha.nadadorId !== undefined) {
                novaToalha.nadadorId = toalha.nadadorId;
            }

            if (toalha.nadadorNome !== undefined) {
                novaToalha.nadadorNome = toalha.nadadorNome;
            }

            return novaToalha;

        });

    } catch (erro) {

        return [];

    }

}

export function salvarToalhas(toalhas) {

    localStorage.setItem(
        STORAGE,
        JSON.stringify(toalhas)
    );

}