const STORAGE = "toalhas";

export function carregarToalhas() {

    try {

        return JSON.parse(
            localStorage.getItem(STORAGE)
        ) || [];

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