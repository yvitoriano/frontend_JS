// Nado Livre v.5 — camada compartilhada de comunicação HTTP.
// JSON Server deve estar em execução na porta 3000 (npm run api).

const BASE_URL = "http://localhost:3000";

export class ErroHttp extends Error {
    constructor(mensagem, status, dados = null) {
        super(mensagem);
        this.name = "ErroHttp";
        this.status = status;
        this.dados = dados;
    }
}

/**
 * Executa uma requisição à API.
 * O body deve ser informado como objeto JavaScript; a função serializa
 * automaticamente os dados e valida a resposta HTTP.
 */
export async function requisicao(caminho, opcoes = {}) {
    const { headers = {}, body, ...configuracoes } = opcoes;

    const possuiBody = body !== undefined && body !== null;
    const resposta = await fetch(`${BASE_URL}${caminho}`, {
        ...configuracoes,
        headers: {
            Accept: "application/json",
            ...(possuiBody ? { "Content-Type": "application/json" } : {}),
            ...headers
        },
        ...(possuiBody ? { body: JSON.stringify(body) } : {})
    });

    const texto = await resposta.text();
    let dados = null;

    if (texto) {
        try {
            dados = JSON.parse(texto);
        } catch {
            dados = texto;
        }
    }

    if (!resposta.ok) {
        const mensagem =
            (dados && typeof dados === "object" && (dados.message || dados.error)) ||
            `Falha na comunicação com o servidor (HTTP ${resposta.status}).`;

        throw new ErroHttp(mensagem, resposta.status, dados);
    }

    return dados;
}
