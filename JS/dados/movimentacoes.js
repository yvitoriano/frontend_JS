const STORAGE = "movimentacoes";


export function carregarMovimentacoes() {

    try {

        const dados =
            JSON.parse(
                localStorage.getItem(STORAGE)
            );

        return Array.isArray(dados)
            ? dados
            : [];

    } catch (erro) {

        console.error(
            "Erro ao carregar movimentações:",
            erro
        );

        return [];

    }

}


export function salvarMovimentacoes(movimentacoes) {

    localStorage.setItem(
        STORAGE,
        JSON.stringify(movimentacoes)
    );

}