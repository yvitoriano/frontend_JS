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
 *
 * Erros lançados (sempre ErroHttp):
 *  - status 0: falha de comunicação (servidor desligado, rede indisponível);
 *  - status 4xx/5xx: resposta HTTP inválida;
 *  - status da resposta: corpo 2xx que deveria ser JSON, mas não é.
 */
export async function requisicao(caminho, opcoes = {}) {
    const { headers = {}, body, ...configuracoes } = opcoes;

    const possuiBody = body !== undefined && body !== null;

    let resposta;

    try {
        resposta = await fetch(`${BASE_URL}${caminho}`, {
            ...configuracoes,
            headers: {
                Accept: "application/json",
                ...(possuiBody ? { "Content-Type": "application/json" } : {}),
                ...headers
            },
            ...(possuiBody ? { body: JSON.stringify(body) } : {})
        });
    } catch (erro) {
        // fetch só rejeita quando não há comunicação com o servidor.
        throw new ErroHttp(
            "Não foi possível conectar ao servidor. Verifique se a API está em execução (npm run api).",
            0,
            { causa: String(erro) }
        );
    }

    const texto = await resposta.text();
    let dados = null;
    let jsonValido = true;

    if (texto) {
        try {
            dados = JSON.parse(texto);
        } catch {
            dados = texto;
            jsonValido = false;
        }
    }

    if (!resposta.ok) {
        const mensagem =
            (dados && typeof dados === "object" && (dados.message || dados.error)) ||
            `Falha na comunicação com o servidor (HTTP ${resposta.status}).`;

        throw new ErroHttp(mensagem, resposta.status, dados);
    }

    if (!jsonValido) {
        throw new ErroHttp(
            "O servidor retornou uma resposta inválida (esperado JSON).",
            resposta.status,
            dados
        );
    }

    return dados;
}
