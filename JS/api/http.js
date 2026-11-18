// Camada HTTP compartilhada: a API Flask é executada na porta 5000.
export const BASE_URL = "http://127.0.0.1:5000";

export class ErroHttp extends Error {
    constructor(mensagem, status, dados = null) {
        super(mensagem);
        this.name = "ErroHttp";
        this.status = status;
        this.dados = dados;
    }
}

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
        throw new ErroHttp(
            "Não foi possível conectar à API Flask. Confira se o backend está em execução em http://127.0.0.1:5000.",
            0,
            { causa: String(erro) }
        );
    }

    const texto = await resposta.text();
    let dados = null;
    if (texto) {
        try { dados = JSON.parse(texto); }
        catch { dados = texto; }
    }

    if (!resposta.ok) {
        const mensagem = dados && typeof dados === "object"
            ? (dados.erro || dados.message || dados.error || `Erro HTTP ${resposta.status}`)
            : `Erro HTTP ${resposta.status}`;
        throw new ErroHttp(mensagem, resposta.status, dados);
    }

    if (texto && typeof dados === "string") {
        throw new ErroHttp("A API retornou uma resposta que não está em formato JSON.", resposta.status, dados);
    }
    return dados;
}
