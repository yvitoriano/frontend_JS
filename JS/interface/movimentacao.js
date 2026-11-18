// Tela de retirada e devolução integrada à API Flask.
import { listarNadadores } from "../api/nadadores.js";
import { listarFuncionarios } from "../api/funcionarios.js";
import { listarToalhas, buscarToalha } from "../api/toalhas.js";
import { cadastrarMovimentacao, devolverMovimentacaoPorToalha } from "../api/movimentacoes.js";
import { criarOpcao } from "./componentes.js";

const selectNadadorRetirada = document.getElementById("nadadorRetirada");
const selectFuncionarioRetirada = document.getElementById("funcionarioRetirada");
const selectToalhaRetirada = document.getElementById("toalhaRetirada");
const selectToalhaDevolucao = document.getElementById("toalhaDevolucao");
const selectFuncionarioDevolucao = document.getElementById("funcionarioDevolucao");
const dataRetirada = document.getElementById("dataRetirada");
const dataDevolucao = document.getElementById("dataDevolucao");
const formRetirada = document.getElementById("formRetirada");
const formDevolucao = document.getElementById("formDevolucao");

function mostrarErro(erro) {
    console.error("Erro ao comunicar com a API:", erro);
    alert(erro?.message || "Não foi possível concluir a operação. Verifique se a API está em execução.");
}
function buscarPorId(lista, id) {
    return lista.find(item => String(item.id) === String(id));
}
function preencherSelect(select, textoPadrao, itens, obterTexto) {
    select.replaceChildren();
    const opcaoPadrao = document.createElement("option");
    opcaoPadrao.value = "";
    opcaoPadrao.textContent = textoPadrao;
    select.appendChild(opcaoPadrao);
    itens.forEach(item => select.appendChild(criarOpcao(item.id, obterTexto(item))));
    select.disabled = itens.length === 0;
}

async function atualizarListas() {
    try {
        const [nadadores, funcionarios, toalhas] = await Promise.all([
            listarNadadores(), listarFuncionarios(), listarToalhas()
        ]);
        preencherSelect(selectNadadorRetirada, "Selecione o nadador", nadadores, item => item.nome);
        preencherSelect(selectFuncionarioRetirada, "Selecione o funcionário", funcionarios, item => item.nome);
        preencherSelect(selectFuncionarioDevolucao, "Selecione o funcionário", funcionarios, item => item.nome);
        preencherSelect(selectToalhaRetirada, "Selecione a toalha disponível", toalhas.filter(item => item.status === "Disponível"), item => item.codigo);
        preencherSelect(selectToalhaDevolucao, "Selecione a toalha em uso", toalhas.filter(item => item.status === "Em uso"), item => item.codigo);
    } catch (erro) {
        mostrarErro(erro);
    }
}

function definirDataAtual() {
    const agora = new Date();
    const local = new Date(agora.getTime() - agora.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    dataRetirada.value = local;
    dataDevolucao.value = local;
}

formRetirada.addEventListener("submit", async event => {
    event.preventDefault();
    const botao = formRetirada.querySelector("button[type='submit'], button:not([type])");
    if (botao) botao.disabled = true;
    try {
        const [nadadores, funcionarios] = await Promise.all([listarNadadores(), listarFuncionarios()]);
        const nadador = buscarPorId(nadadores, selectNadadorRetirada.value);
        const funcionario = buscarPorId(funcionarios, selectFuncionarioRetirada.value);
        if (!nadador || !funcionario || !selectToalhaRetirada.value || !dataRetirada.value) {
            alert("Preencha todos os campos da retirada.");
            return;
        }
        const toalha = await buscarToalha(selectToalhaRetirada.value);
        if (toalha.status !== "Disponível") {
            alert("Esta toalha não está disponível.");
            return;
        }
        await cadastrarMovimentacao({
            funcionarioId: funcionario.id,
            nadadorId: nadador.id,
            toalhaId: toalha.id,
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

formDevolucao.addEventListener("submit", async event => {
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
            return;
        }
        await devolverMovimentacaoPorToalha(toalha.id, dataDevolucao.value);
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

window.addEventListener("pageshow", atualizarListas);
definirDataAtual();
atualizarListas();
