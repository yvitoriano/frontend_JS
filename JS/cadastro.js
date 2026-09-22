let proximoIdNadador = 1;
let proximoIdFuncionario = 1;

const nadadores = [];
const funcionarios = [];
const toalhas = [];


/* ABAS */

const tabs = document.querySelectorAll(".tab");
const conteudos = document.querySelectorAll(".tab-content");

tabs.forEach(function (tab) {

    tab.addEventListener("click", function () {

        const nomeAba = tab.dataset.tab;

        tabs.forEach(function (item) {
            item.classList.remove("active");
        });

        conteudos.forEach(function (conteudo) {
            conteudo.classList.remove("active");
        });

        tab.classList.add("active");

        document
            .getElementById(nomeAba)
            .classList.add("active");

    });

});


/* NADADOR */

document
    .getElementById("formNadador")
    .addEventListener("submit", function (event) {

        event.preventDefault();

        const nadador = {
            id: proximoIdNadador,
            nome: document.getElementById("nomeNadador").value,
            cpf: document.getElementById("cpfNadador").value,
            telefone: document.getElementById("telefoneNadador").value,
            email: document.getElementById("emailNadador").value
        };

        nadadores.push(nadador);

        proximoIdNadador++;

        alert("Nadador cadastrado com sucesso.");

        this.reset();

    });


/* FUNCIONÁRIO */

document
    .getElementById("formFuncionario")
    .addEventListener("submit", function (event) {

        event.preventDefault();

        const funcionario = {
            id: proximoIdFuncionario,
            nome: document.getElementById("nomeFuncionario").value,
            cpf: document.getElementById("cpfFuncionario").value,
            telefone: document.getElementById("telefoneFuncionario").value,
            email: document.getElementById("emailFuncionario").value
        };

        funcionarios.push(funcionario);

        proximoIdFuncionario++;

        alert("Funcionário cadastrado com sucesso.");

        this.reset();

    });


/* TOALHAS */

document
    .getElementById("formToalha")
    .addEventListener("submit", function (event) {

        event.preventDefault();

        const codigo = document
            .getElementById("codigoToalha")
            .value
            .trim();

        const existe = toalhas.some(function (toalha) {

            return toalha.codigo === codigo;

        });

        if (existe) {

            alert(
                "Já existe uma toalha com esse código identificador."
            );

            return;

        }

        toalhas.push({
            codigo: codigo,
            status: "Disponível"
        });

        alert("Toalha cadastrada com sucesso.");

        this.reset();

    });
