const STORAGE = "nadadores";

export function carregarNadadores() {

    try {

        return JSON.parse(
            localStorage.getItem(STORAGE)
        ) || [];

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