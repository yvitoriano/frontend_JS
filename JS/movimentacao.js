

/* ==================================================
   CLASSES
================================================== */

class Nadador {

    constructor(id, nome) {

        this.id = id;
        this.nome = nome;

    }

}


class Funcionario {

    constructor(id, nome) {

        this.id = id;
        this.nome = nome;

    }

}


class Toalha {

    constructor(id, codigoIdentificador, status) {

        this.id = id;
        this.codigoIdentificador = codigoIdentificador;
        this.status = status;

    }

}


/* ==================================================
   DADOS DE EXEMPLO
================================================== */

const nadadores = [

    new Nadador("01", "João Silva"),

    new Nadador("02", "Maria Santos"),

    new Nadador("03", "Pedro Oliveira"),

    new Nadador("04", "Ana Beatriz")

];


const funcionarios = [

    new Funcionario("01", "Carlos Souza"),

    new Funcionario("02", "Mariana Lima"),

    new Funcionario("03", "Fernanda Costa")

];


const toalhas = [

    new Toalha("01", "TOL-001", "Disponível"),

    new Toalha("02", "TOL-002", "Em uso"),

    new Toalha("03", "TOL-003", "Disponível"),

    new Toalha("04", "TOL-004", "Disponível"),

    new Toalha("05", "TOL-005", "Em uso"),

    new Toalha("06", "TOL-006", "Disponível")

];


/* ==================================================
   ELEMENTOS
================================================== */

const selectNadadorRetirada =
    document.getElementById("nadadorRetirada");


const selectFuncionarioRetirada =
    document.getElementById("funcionarioRetirada");


const selectToalhaRetirada =
    document.getElementById("toalhaRetirada");


const selectToalhaDevolucao =
    document.getElementById("toalhaDevolucao");


const selectFuncionarioDevolucao =
    document.getElementById("funcionarioDevolucao");


const dataRetirada =
    document.getElementById("dataRetirada");


const dataDevolucao =
    document.getElementById("dataDevolucao");


const formRetirada =
    document.getElementById("formRetirada");


const formDevolucao =
    document.getElementById("formDevolucao");


/* ==================================================
   CARREGAR NADADORES
================================================== */

function carregarNadadores() {

    nadadores.forEach(function (nadador) {

        const option =
            document.createElement("option");

        option.value = nadador.id;

        option.textContent = nadador.nome;

        selectNadadorRetirada.appendChild(option);

    });

}


/* ==================================================
   CARREGAR FUNCIONÁRIOS
================================================== */

function carregarFuncionarios() {

    funcionarios.forEach(function (funcionario) {

        const optionRetirada =
            document.createElement("option");

        optionRetirada.value = funcionario.id;

        optionRetirada.textContent =
            funcionario.nome;

        selectFuncionarioRetirada.appendChild(
            optionRetirada
        );


        const optionDevolucao =
            document.createElement("option");

        optionDevolucao.value = funcionario.id;

        optionDevolucao.textContent =
            funcionario.nome;

        selectFuncionarioDevolucao.appendChild(
            optionDevolucao
        );

    });

}


/* ==================================================
   CARREGAR TOALHAS DISPONÍVEIS
================================================== */

function carregarToalhasDisponiveis() {

    selectToalhaRetirada.innerHTML = `
        <option value="">
            Selecione a toalha disponível
        </option>
    `;


    toalhas.forEach(function (toalha) {

        if (toalha.status === "Disponível") {

            const option =
                document.createElement("option");

            option.value = toalha.id;

            option.textContent =
                toalha.codigoIdentificador;

            selectToalhaRetirada.appendChild(option);

        }

    });

}


/* ==================================================
   CARREGAR TOALHAS EM USO
================================================== */

function carregarToalhasEmUso() {

    selectToalhaDevolucao.innerHTML = `
        <option value="">
            Selecione a toalha
        </option>
    `;


    toalhas.forEach(function (toalha) {

        if (toalha.status === "Em uso") {

            const option =
                document.createElement("option");

            option.value = toalha.id;

            option.textContent =
                toalha.codigoIdentificador;

            selectToalhaDevolucao.appendChild(option);

        }

    });

}


/* ==================================================
   DATA E HORA ATUAL
================================================== */

function definirDataAtual() {

    const agora = new Date();


    const ano =
        agora.getFullYear();


    const mes =
        String(
            agora.getMonth() + 1
        ).padStart(2, "0");


    const dia =
        String(
            agora.getDate()
        ).padStart(2, "0");


    const hora =
        String(
            agora.getHours()
        ).padStart(2, "0");


    const minutos =
        String(
            agora.getMinutes()
        ).padStart(2, "0");


    const dataFormatada =
        `${ano}-${mes}-${dia}T${hora}:${minutos}`;


    dataRetirada.value =
        dataFormatada;


    dataDevolucao.value =
        dataFormatada;

}


/* ==================================================
   REGISTRAR RETIRADA
================================================== */

formRetirada.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const toalhaId =
            selectToalhaRetirada.value;


        const toalha =
            toalhas.find(function (item) {

                return item.id === toalhaId;

            });


        if (!toalha) {

            return;

        }


        toalha.status = "Em uso";


        alert(
            "Retirada registrada com sucesso!"
        );


        formRetirada.reset();


        definirDataAtual();


        carregarToalhasDisponiveis();

        carregarToalhasEmUso();

    }
);


/* ==================================================
   REGISTRAR DEVOLUÇÃO
================================================== */

formDevolucao.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const toalhaId =
            selectToalhaDevolucao.value;


        const toalha =
            toalhas.find(function (item) {

                return item.id === toalhaId;

            });


        if (!toalha) {

            return;

        }


        toalha.status = "Disponível";


        alert(
            "Devolução registrada com sucesso!"
        );


        formDevolucao.reset();


        definirDataAtual();


        carregarToalhasDisponiveis();

        carregarToalhasEmUso();

    }
);


/* ==================================================
   INICIALIZAÇÃO
================================================== */

carregarNadadores();

carregarFuncionarios();

carregarToalhasDisponiveis();

carregarToalhasEmUso();

definirDataAtual();

