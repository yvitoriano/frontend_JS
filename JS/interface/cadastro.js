import { Nadador } from "../classes/nadador.js";
import { Funcionario } from "../classes/funcionario.js";
import { Toalha } from "../classes/toalha.js";

import {
    listarNadadores,
    cadastrarNadador,
    atualizarNadador,
    excluirNadador
} from "../api/nadadores.js";

import {
    listarFuncionarios,
    cadastrarFuncionario,
    atualizarFuncionario,
    excluirFuncionario
} from "../api/funcionarios.js";

import {
    listarToalhas,
    cadastrarToalha,
    atualizarToalha,
    excluirToalha
} from "../api/toalhas.js";

import { listarMovimentacoes } from "../api/movimentacoes.js";

import {
    criarCabecalhoTabela,
    criarLinhaFuncionario,
    criarLinhaNadador,
    criarLinhaToalha,
    criarBotaoPaginacao
} from "./componentes.js";

const POR_PAGINA = 5;

let tipoAtual = "nadador";
let paginaAtual = 1;
let termoBusca = "";
let edicaoAtual = null;
let exclusaoAtual = null;

/* AUXILIARES */

function normalizar(texto) {
    return String(texto ?? "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function escapeHtml(valor) {
    const elemento = document.createElement("div");
    elemento.textContent = String(valor ?? "");
    return elemento.innerHTML;
}

function mostrarErro(erro) {
    console.error("Erro ao comunicar com a API:", erro);
    alert(
        erro?.message ||
        "Não foi possível concluir a operação. Verifique se o servidor da API está em execução."
    );
}

async function listarRegistros(tipo) {
    if (tipo === "nadador") return await listarNadadores();
    if (tipo === "funcionario") return await listarFuncionarios();
    return await listarToalhas();
}

/* ABAS */

const tabs = document.querySelectorAll(".tab");
const conteudos = document.querySelectorAll(".tab-content");

tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        const nomeAba = tab.dataset.tab;

        tabs.forEach((item) => item.classList.remove("active"));
        conteudos.forEach((conteudo) => conteudo.classList.remove("active"));

        tab.classList.add("active");
        document.getElementById(nomeAba)?.classList.add("active");
    });
});

/* CADASTRO DE NADADORES E FUNCIONÁRIOS */

async function cadastrarPessoa(tipo, formulario, ids) {
    try {
        const nome = document.getElementById(ids.nome).value.trim();
        const cpf = document.getElementById(ids.cpf).value.trim();
        const telefone = document.getElementById(ids.telefone).value.trim();
        const email = document.getElementById(ids.email).value.trim();

        if (!nome || !cpf || !telefone || !email) return;

        // O JSON Server gera o ID automaticamente.
        const registro = tipo === "nadador"
            ? new Nadador(undefined, nome, cpf, telefone, email)
            : new Funcionario(undefined, nome, cpf, telefone, email);

        const dados = {
            nome: registro.nome,
            cpf: registro.cpf,
            telefone: registro.telefone,
            email: registro.email
        };

        if (tipo === "nadador") {
            await cadastrarNadador(dados);
            alert("Nadador cadastrado com sucesso.");
        } else {
            await cadastrarFuncionario(dados);
            alert("Funcionário cadastrado com sucesso.");
        }

        formulario.reset();

        if (tipoAtual === tipo) {
            await renderizarLista();
        }

    } catch (erro) {
        mostrarErro(erro);
    }
}

document.getElementById("formNadador")?.addEventListener("submit", async function (event) {
    event.preventDefault();

    await cadastrarPessoa("nadador", this, {
        nome: "nomeNadador",
        cpf: "cpfNadador",
        telefone: "telefoneNadador",
        email: "emailNadador"
    });
});

document.getElementById("formFuncionario")?.addEventListener("submit", async function (event) {
    event.preventDefault();

    await cadastrarPessoa("funcionario", this, {
        nome: "nomeFuncionario",
        cpf: "cpfFuncionario",
        telefone: "telefoneFuncionario",
        email: "emailFuncionario"
    });
});

/* CADASTRO DE TOALHA */

document.getElementById("formToalha")?.addEventListener("submit", async function (event) {
    event.preventDefault();

    try {
        const codigo = document.getElementById("codigoToalha").value.trim();

        if (!codigo) return;

        const toalhas = await listarToalhas();

        const existe = toalhas.some((toalha) =>
            normalizar(toalha.codigo) === normalizar(codigo)
        );

        if (existe) {
            alert("Já existe uma toalha com esse código identificador.");
            return;
        }

        const novaToalha = new Toalha(undefined, codigo, "Disponível");

        await cadastrarToalha({
            codigo: novaToalha.codigo,
            status: novaToalha.status
        });

        alert("Toalha cadastrada com sucesso.");

        this.reset();

        if (tipoAtual === "toalha") {
            await renderizarLista();
        }

    } catch (erro) {
        mostrarErro(erro);
    }
});

/* MODAIS */

const modalLista = document.getElementById("modalLista");
const modalEdicao = document.getElementById("modalEdicao");
const modalConfirmacao = document.getElementById("modalConfirmacao");

function abrirModal(modal) {
    if (!modal) return;

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");

    document.body.classList.add("modal-open");
}

function fecharModal(modal) {
    if (!modal) return;

    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");

    if (!document.querySelector(".modal-overlay.open")) {
        document.body.classList.remove("modal-open");
    }
}

/* VER CADASTRADOS */

document.querySelectorAll("[data-lista]").forEach((botao) => {
    botao.addEventListener("click", async () => {
        tipoAtual = botao.dataset.lista;

        paginaAtual = 1;
        termoBusca = "";

        document.getElementById("buscaCadastro").value = "";

        abrirModal(modalLista);

        await renderizarLista();
    });
});

/* FECHAR MODAIS */

document.querySelectorAll("[data-fechar]").forEach((botao) => {
    botao.addEventListener("click", () => {
        const modais = {
            lista: "modalLista",
            edicao: "modalEdicao",
            confirmacao: "modalConfirmacao"
        };

        fecharModal(document.getElementById(modais[botao.dataset.fechar]));
    });
});

[modalLista, modalEdicao, modalConfirmacao].filter(Boolean).forEach((modal) => {
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            fecharModal(modal);
        }
    });
});

/* BUSCA */

document.getElementById("buscaCadastro")?.addEventListener("input", async (event) => {
    termoBusca = event.target.value;
    paginaAtual = 1;

    await renderizarLista();
});

async function dadosFiltrados() {
    const registros = await listarRegistros(tipoAtual);
    const pesquisa = normalizar(termoBusca);

    return registros.filter((registro) => {
        if (!pesquisa) return true;

        return Object.values(registro).some((valor) =>
            normalizar(valor).includes(pesquisa)
        );
    });
}

/* RENDERIZAR LISTA */

async function renderizarLista() {
    try {
        let configuracao;

        if (tipoAtual === "toalha") {
            configuracao = {
                titulo: "Toalhas cadastradas",
                colunas: ["ID", "Código", "Status", "Ações"]
            };
        } else {
            configuracao = {
                titulo: tipoAtual === "nadador"
                    ? "Nadadores cadastrados"
                    : "Funcionários cadastrados",

                colunas: ["ID", "Nome", "CPF", "Telefone", "E-mail", "Ações"]
            };
        }

        document.getElementById("tituloLista").textContent = configuracao.titulo;

        document.getElementById("cabecalhoLista").replaceChildren(
            criarCabecalhoTabela(configuracao.colunas)
        );

        const todos = await dadosFiltrados();

        const quantidadePaginas = Math.ceil(todos.length / POR_PAGINA);

        if (quantidadePaginas > 0 && paginaAtual > quantidadePaginas) {
            paginaAtual = quantidadePaginas;
        }

        if (quantidadePaginas === 0) {
            paginaAtual = 1;
        }

        const inicio = (paginaAtual - 1) * POR_PAGINA;

        const itens = todos.slice(inicio, inicio + POR_PAGINA);

        const corpo = document.getElementById("corpoLista");

        corpo.replaceChildren();

        itens.forEach((registro) => {
            const callbacks = {
                aoEditar: (id) => abrirEdicao(id),

                aoExcluir: (id) => {
                    exclusaoAtual = id;
                    abrirModal(modalConfirmacao);
                }
            };

            let linha;

            if (tipoAtual === "toalha") {
                linha = criarLinhaToalha(registro, callbacks);
            } else if (tipoAtual === "nadador") {
                linha = criarLinhaNadador(registro, callbacks);
            } else {
                linha = criarLinhaFuncionario(registro, callbacks);
            }

            corpo.appendChild(linha);
        });

        document.getElementById("listaVazia").hidden = todos.length !== 0;

        document.querySelector(".table-wrap").hidden = todos.length === 0;

        if (todos.length > 0) {
            const final = Math.min(inicio + POR_PAGINA, todos.length);

            const palavraRegistro = todos.length === 1
                ? "registro"
                : "registros";

            document.getElementById("resumoLista").textContent =
                `Mostrando ${inicio + 1}-${final} de ${todos.length} ${palavraRegistro}`;

        } else {
            document.getElementById("resumoLista").textContent = "";
        }

        renderizarPaginacao(quantidadePaginas);

    } catch (erro) {
        mostrarErro(erro);
    }
}

/* PAGINAÇÃO */

function renderizarPaginacao(totalPaginas) {
    const paginacao = document.getElementById("paginacaoLista");

    paginacao.replaceChildren();

    if (totalPaginas === 0) return;

    const botaoAnterior = criarBotaoPaginacao(
        "‹",
        async () => {
            if (paginaAtual > 1) {
                paginaAtual--;
                await renderizarLista();
            }
        },
        paginaAtual === 1
    );

    botaoAnterior.setAttribute("aria-label", "Página anterior");

    paginacao.appendChild(botaoAnterior);

    for (let pagina = 1; pagina <= totalPaginas; pagina++) {
        const botao = criarBotaoPaginacao(
            pagina,
            async () => {
                paginaAtual = pagina;
                await renderizarLista();
            },
            false,
            pagina === paginaAtual
        );

        if (pagina === paginaAtual) {
            botao.classList.add("active");
        }

        paginacao.appendChild(botao);
    }

    const botaoProxima = criarBotaoPaginacao(
        "›",
        async () => {
            if (paginaAtual < totalPaginas) {
                paginaAtual++;
                await renderizarLista();
            }
        },
        paginaAtual === totalPaginas
    );

    botaoProxima.setAttribute("aria-label", "Próxima página");

    paginacao.appendChild(botaoProxima);
}

/* EDIÇÃO */

async function abrirEdicao(id) {
    try {
        const registros = await listarRegistros(tipoAtual);

        const registro = registros.find(
            (item) => String(item.id) === String(id)
        );

        if (!registro) return;

        edicaoAtual = registro.id;

        document.getElementById("edicaoId").textContent =
            String(registro.id).padStart(3, "0");

        if (tipoAtual === "toalha") {
            document.getElementById("tituloEdicao").textContent = "Editar toalha";

            document.getElementById("camposEdicao").innerHTML = `
                <div class="edit-field">
                    <label for="editCodigo">Código da toalha</label>

                    <input
                        id="editCodigo"
                        type="text"
                        required
                        value="${escapeHtml(registro.codigo)}"
                    >
                </div>

                <div class="status-info">
                    Status:
                    <strong>${escapeHtml(registro.status)}</strong>
                </div>
            `;

        } else {
            document.getElementById("tituloEdicao").textContent =
                tipoAtual === "nadador"
                    ? "Editar nadador"
                    : "Editar funcionário";

            document.getElementById("camposEdicao").innerHTML = `
                <div class="edit-field">
                    <label for="editNome">Nome</label>

                    <input
                        id="editNome"
                        type="text"
                        required
                        value="${escapeHtml(registro.nome)}"
                    >
                </div>

                <div class="edit-field">
                    <label for="editCpf">CPF</label>

                    <input
                        id="editCpf"
                        type="text"
                        required
                        value="${escapeHtml(registro.cpf)}"
                    >
                </div>

                <div class="edit-field">
                    <label for="editEmail">E-mail</label>

                    <input
                        id="editEmail"
                        type="email"
                        required
                        value="${escapeHtml(registro.email)}"
                    >
                </div>

                <div class="edit-field">
                    <label for="editTelefone">Telefone</label>

                    <input
                        id="editTelefone"
                        type="text"
                        required
                        value="${escapeHtml(registro.telefone)}"
                    >
                </div>
            `;
        }

        abrirModal(modalEdicao);

    } catch (erro) {
        mostrarErro(erro);
    }
}

/* SALVAR EDIÇÃO */

document.getElementById("formEdicao")?.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
        const registros = await listarRegistros(tipoAtual);

        const registroAtual = registros.find(
            (registro) => String(registro.id) === String(edicaoAtual)
        );

        if (!registroAtual) return;

        if (tipoAtual === "toalha") {
            const codigo = document.getElementById("editCodigo").value.trim();

            if (!codigo) return;

            const codigoJaExiste = registros.some((toalha) =>
                String(toalha.id) !== String(edicaoAtual) &&
                normalizar(toalha.codigo) === normalizar(codigo)
            );

            if (codigoJaExiste) {
                alert("Já existe uma toalha com esse código identificador.");
                return;
            }

            await atualizarToalha(edicaoAtual, { codigo });

        } else {
            const nome = document.getElementById("editNome").value.trim();
            const cpf = document.getElementById("editCpf").value.trim();
            const email = document.getElementById("editEmail").value.trim();
            const telefone = document.getElementById("editTelefone").value.trim();

            if (!nome || !cpf || !email || !telefone) return;

            const dados = {
                nome,
                cpf,
                email,
                telefone
            };

            if (tipoAtual === "nadador") {
                await atualizarNadador(edicaoAtual, dados);
            } else {
                await atualizarFuncionario(edicaoAtual, dados);
            }
        }

        fecharModal(modalEdicao);

        await renderizarLista();

    } catch (erro) {
        mostrarErro(erro);
    }
});

/* EXCLUSÃO */

document.getElementById("confirmarExclusao")?.addEventListener("click", async () => {
    try {
        const movimentacoes = await listarMovimentacoes();

        const registroVinculado = movimentacoes.some((movimentacao) => {
            if (tipoAtual === "nadador") {
                return String(movimentacao.nadadorId) === String(exclusaoAtual);
            }

            if (tipoAtual === "funcionario") {
                return String(movimentacao.funcionarioId) === String(exclusaoAtual);
            }

            if (tipoAtual === "toalha") {
                return String(movimentacao.toalhaId) === String(exclusaoAtual);
            }

            return false;
        });

        if (registroVinculado) {
            alert(
                "Não é possível excluir este cadastro, pois ele está vinculado a uma movimentação."
            );

            exclusaoAtual = null;

            fecharModal(modalConfirmacao);

            return;
        }

        if (tipoAtual === "nadador") {
            await excluirNadador(exclusaoAtual);

        } else if (tipoAtual === "funcionario") {
            await excluirFuncionario(exclusaoAtual);

        } else {
            await excluirToalha(exclusaoAtual);
        }

        exclusaoAtual = null;

        fecharModal(modalConfirmacao);

        await renderizarLista();

    } catch (erro) {
        mostrarErro(erro);
    }
});