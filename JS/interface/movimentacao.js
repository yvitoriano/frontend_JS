// Nado Livre v.5 — tela de movimentação (retirada e devolução).
// Todos os dados vêm da API (JSON Server); não há uso de localStorage.

import { listarNadadores } from "../api/nadadores.js";
import { listarFuncionarios } from "../api/funcionarios.js";
import {
    listarToalhas,
    buscarToalha,
    atualizarToalha,
    substituirToalha
} from "../api/toalhas.js";
import { cadastrarMovimentacao } from "../api/movimentacoes.js";

import { criarOpcao } from "./componentes.js";

/* ELEMENTOS */

const selectNadadorRetirada = document.getElementById("nadadorRetirada");
const selectFuncionarioRetirada = document.getElementById("funcionarioRetirada");
const selectToalhaRetirada = document.getElementById("toalhaRetirada");

const selectToalhaDevolucao = document.getElementById("toalhaDevolucao");
const selectFuncionarioDevolucao = document.getElementById("funcionarioDevolucao");

const dataRetirada = document.getElementById("dataRetirada");
const dataDevolucao = document.getElementById("dataDevolucao");

const formRetirada = document.getElementById("formRetirada");
const formDevolucao = document.getElementById("formDevolucao");

/* AUXILIARES */

function mostrarErro(erro) {
    console.error("Erro ao comunicar com a API:", erro);

    alert(
        erro?.message ||
        "Não foi possível concluir a operação. Verifique se o servidor da API está em execução."
    );
}

function buscarPorId(lista, id) {
    return lista.find((item) => String(item.id) === String(id));
}

function preencherSelect(select, textoPadrao, itens, obterTexto) {
    select.replaceChildren();

    const opcaoPadrao = document.createElement("option");
    opcaoPadrao.value = "";
    opcaoPadrao.textContent = textoPadrao;
    select.appendChild(opcaoPadrao);

    itens.forEach((item) => {
        select.appendChild(criarOpcao(item.id, obterTexto(item)));
    });

    select.disabled = itens.length === 0;
}

/* ATUALIZAR LISTAS (uma única leitura de cada recurso) */

async function atualizarListas() {
    try {
        const [nadadores, funcionarios, toalhas] = await Promise.all([
            listarNadadores(),
            listarFuncionarios(),
            listarToalhas()
        ]);

        preencherSelect(
            selectNadadorRetirada,
            "Selecione o nadador",
            nadadores,
            (nadador) => nadador.nome
        );

        preencherSelect(
            selectFuncionarioRetirada,
            "Selecione o funcionário",
            funcionarios,
            (funcionario) => funcionario.nome
        );

        preencherSelect(
            selectFuncionarioDevolucao,
            "Selecione o funcionário",
            funcionarios,
            (funcionario) => funcionario.nome
        );

        preencherSelect(
            selectToalhaRetirada,
            "Selecione a toalha disponível",
            toalhas.filter((toalha) => toalha.status === "Disponível"),
            (toalha) => toalha.codigo
        );

        preencherSelect(
            selectToalhaDevolucao,
            "Selecione a toalha",
            toalhas.filter((toalha) => toalha.status === "Em uso"),
            (toalha) => toalha.codigo
        );

    } catch (erro) {
        mostrarErro(erro);
    }
}

/* DATA E HORA ATUAL */

function definirDataAtual() {
    const agora = new Date();

    const ano = agora.getFullYear();
    const mes = String(agora.getMonth() + 1).padStart(2, "0");
    const dia = String(agora.getDate()).padStart(2, "0");
    const hora = String(agora.getHours()).padStart(2, "0");
    const minutos = String(agora.getMinutes()).padStart(2, "0");

    const dataFormatada = `${ano}-${mes}-${dia}T${hora}:${minutos}`;

    dataRetirada.value = dataFormatada;
    dataDevolucao.value = dataFormatada;
}

/* REGISTRAR RETIRADA */

formRetirada.addEventListener("submit", async function (event) {
    event.preventDefault();

    const botao = formRetirada.querySelector("button[type='submit'], button:not([type])");
    if (botao) botao.disabled = true;

    try {
        const [nadadores, funcionarios] = await Promise.all([
            listarNadadores(),
            listarFuncionarios()
        ]);

        const nadador = buscarPorId(nadadores, selectNadadorRetirada.value);
        const funcionario = buscarPorId(funcionarios, selectFuncionarioRetirada.value);

        if (
            !nadador ||
            !funcionario ||
            !selectToalhaRetirada.value ||
            !dataRetirada.value
        ) {
            alert("Preencha todos os campos da retirada.");
            return;
        }

        // Relê a toalha no servidor para garantir que ainda está disponível.
        const toalha = await buscarToalha(selectToalhaRetirada.value);

        if (toalha.status !== "Disponível") {
            alert("Esta toalha não está disponível.");
            await atualizarListas();
            return;
        }

        await atualizarToalha(toalha.id, {
            status: "Em uso",
            nadadorId: nadador.id,
            nadadorNome: nadador.nome
        });

        await cadastrarMovimentacao({
            tipo: "Retirada",
            toalhaId: toalha.id,
            toalhaCodigo: toalha.codigo,
            funcionarioId: funcionario.id,
            funcionarioNome: funcionario.nome,
            nadadorId: nadador.id,
            nadadorNome: nadador.nome,
            dataHora: dataRetirada.value
        });

        alert("Retirada registrada com sucesso!");

        formRetirada.reset();
        definirDataAtual();

    } catch (erro) {
        mostrarErro(erro);

    } finally {
        if (botao) botao.disabled = false;
        await atualizarListas();
    }
});

/* REGISTRAR DEVOLUÇÃO */

formDevolucao.addEventListener("submit", async function (event) {
    event.preventDefault();

    const botao = formDevolucao.querySelector("button[type='submit'], button:not([type])");
    if (botao) botao.disabled = true;

    try {
        const funcionarios = await listarFuncionarios();

        const funcionario = buscarPorId(funcionarios, selectFuncionarioDevolucao.value);

        if (!funcionario || !selectToalhaDevolucao.value || !dataDevolucao.value) {
            alert("Preencha todos os campos da devolução.");
            return;
        }

        const toalha = await buscarToalha(selectToalhaDevolucao.value);

        if (toalha.status !== "Em uso") {
            alert("Esta toalha não está em uso.");
            await atualizarListas();
            return;
        }

        // O nadador que retirou fica registrado na própria toalha.
        await cadastrarMovimentacao({
            tipo: "Devolução",
            toalhaId: toalha.id,
            toalhaCodigo: toalha.codigo,
            funcionarioId: funcionario.id,
            funcionarioNome: funcionario.nome,
            nadadorId: toalha.nadadorId ?? null,
            nadadorNome: toalha.nadadorNome ?? null,
            dataHora: dataDevolucao.value
        });

        // PUT substitui o registro, removendo nadadorId e nadadorNome.
        await substituirToalha(toalha.id, {
            codigo: toalha.codigo,
            status: "Disponível"
        });

        alert("Devolução registrada com sucesso!");

        formDevolucao.reset();
        definirDataAtual();

    } catch (erro) {
        mostrarErro(erro);

    } finally {
        if (botao) botao.disabled = false;
        await atualizarListas();
    }
});

/* ATUALIZAR AO VOLTAR PARA A PÁGINA */

window.addEventListener("pageshow", function () {
    atualizarListas();
});

definirDataAtual();
atualizarListas();
