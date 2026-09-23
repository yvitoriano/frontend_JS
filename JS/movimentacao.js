const STORAGE = {
    nadadores: "nadadores",
    funcionarios: "funcionarios",
    toalhas: "toalhas",
    movimentacoes: "movimentacoes"
};


/*ELEMENTOS*/

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


/*CARREGAR DADOS*/

function carregarDados(chave) {

    try {

        const dados =
            JSON.parse(
                localStorage.getItem(chave)
            );

        return Array.isArray(dados)
            ? dados
            : [];

    } catch (erro) {

        console.error(
            "Erro ao carregar dados:",
            erro
        );

        return [];

    }

}


/*SALVAR DADOS*/

function salvarDados(chave, dados) {

    localStorage.setItem(
        chave,
        JSON.stringify(dados)
    );

}


/*NADADORES*/

function carregarNadadores() {

    const nadadores =
        carregarDados(
            STORAGE.nadadores
        );


    selectNadadorRetirada.innerHTML = `
        <option value="">
            Selecione o nadador
        </option>
    `;


    nadadores.forEach(
        function (nadador) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                nadador.id;


            option.textContent =
                nadador.nome;


            selectNadadorRetirada.appendChild(
                option
            );

        }
    );


    selectNadadorRetirada.disabled =
        nadadores.length === 0;

}


/*FUNCIONÁRIOS*/

function carregarFuncionarios() {

    const funcionarios =
        carregarDados(
            STORAGE.funcionarios
        );


    selectFuncionarioRetirada.innerHTML = `
        <option value="">
            Selecione o funcionário
        </option>
    `;


    selectFuncionarioDevolucao.innerHTML = `
        <option value="">
            Selecione o funcionário
        </option>
    `;


    funcionarios.forEach(
        function (funcionario) {

            const optionRetirada =
                document.createElement(
                    "option"
                );


            optionRetirada.value =
                funcionario.id;


            optionRetirada.textContent =
                funcionario.nome;


            selectFuncionarioRetirada.appendChild(
                optionRetirada
            );


            const optionDevolucao =
                document.createElement(
                    "option"
                );


            optionDevolucao.value =
                funcionario.id;


            optionDevolucao.textContent =
                funcionario.nome;


            selectFuncionarioDevolucao.appendChild(
                optionDevolucao
            );

        }
    );


    const semFuncionarios =
        funcionarios.length === 0;


    selectFuncionarioRetirada.disabled =
        semFuncionarios;


    selectFuncionarioDevolucao.disabled =
        semFuncionarios;

}


/*TOALHAS DISPONÍVEIS*/

function carregarToalhasDisponiveis() {

    const toalhas =
        carregarDados(
            STORAGE.toalhas
        );


    const disponiveis =
        toalhas.filter(
            function (toalha) {

                return (
                    toalha.status ===
                    "Disponível"
                );

            }
        );


    selectToalhaRetirada.innerHTML = `
        <option value="">
            Selecione a toalha disponível
        </option>
    `;


    disponiveis.forEach(
        function (toalha) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                toalha.id;


            option.textContent =
                toalha.codigo;


            selectToalhaRetirada.appendChild(
                option
            );

        }
    );


    selectToalhaRetirada.disabled =
        disponiveis.length === 0;

}


/*TOALHAS EM USO*/

function carregarToalhasEmUso() {

    const toalhas =
        carregarDados(
            STORAGE.toalhas
        );


    const emUso =
        toalhas.filter(
            function (toalha) {

                return (
                    toalha.status ===
                    "Em uso"
                );

            }
        );


    selectToalhaDevolucao.innerHTML = `
        <option value="">
            Selecione a toalha
        </option>
    `;


    emUso.forEach(
        function (toalha) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                toalha.id;


            option.textContent =
                toalha.codigo;


            selectToalhaDevolucao.appendChild(
                option
            );

        }
    );


    selectToalhaDevolucao.disabled =
        emUso.length === 0;

}


/*ATUALIZAR TODAS AS LISTAS*/

function atualizarListas() {

    carregarNadadores();

    carregarFuncionarios();

    carregarToalhasDisponiveis();

    carregarToalhasEmUso();

}


/*DATA E HORA ATUAL*/

function definirDataAtual() {

    const agora =
        new Date();


    const ano =
        agora.getFullYear();


    const mes =
        String(
            agora.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const dia =
        String(
            agora.getDate()
        ).padStart(
            2,
            "0"
        );


    const hora =
        String(
            agora.getHours()
        ).padStart(
            2,
            "0"
        );


    const minutos =
        String(
            agora.getMinutes()
        ).padStart(
            2,
            "0"
        );


    const dataFormatada =
        `${ano}-${mes}-${dia}T${hora}:${minutos}`;


    dataRetirada.value =
        dataFormatada;


    dataDevolucao.value =
        dataFormatada;

}


/*BUSCAR REGISTRO PELO ID*/

function buscarPorId(lista, id) {

    return lista.find(
        function (item) {

            return (
                String(item.id) ===
                String(id)
            );

        }
    );

}


/*SALVAR MOVIMENTAÇÃO*/

function registrarMovimentacao(
    tipo,
    toalha,
    funcionario,
    nadador,
    dataHora
) {

    const movimentacoes =
        carregarDados(
            STORAGE.movimentacoes
        );


    const maiorId =
        movimentacoes.reduce(
            function (maior, movimentacao) {

                return Math.max(
                    maior,
                    Number(
                        movimentacao.id
                    ) || 0
                );

            },
            0
        );


    const movimentacao = {

        id:
            maiorId + 1,

        tipo:
            tipo,

        toalhaId:
            toalha.id,

        toalhaCodigo:
            toalha.codigo,

        funcionarioId:
            funcionario.id,

        funcionarioNome:
            funcionario.nome,

        dataHora:
            dataHora

    };


    if (nadador) {

        movimentacao.nadadorId =
            nadador.id;

        movimentacao.nadadorNome =
            nadador.nome;

    }


    movimentacoes.push(
        movimentacao
    );


    salvarDados(
        STORAGE.movimentacoes,
        movimentacoes
    );

}


/*REGISTRAR RETIRADA*/

formRetirada.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const nadadores =
            carregarDados(
                STORAGE.nadadores
            );


        const funcionarios =
            carregarDados(
                STORAGE.funcionarios
            );


        const toalhas =
            carregarDados(
                STORAGE.toalhas
            );


        const nadador =
            buscarPorId(
                nadadores,
                selectNadadorRetirada.value
            );


        const funcionario =
            buscarPorId(
                funcionarios,
                selectFuncionarioRetirada.value
            );


        const toalha =
            buscarPorId(
                toalhas,
                selectToalhaRetirada.value
            );


        if (
            !nadador ||
            !funcionario ||
            !toalha ||
            !dataRetirada.value
        ) {

            alert(
                "Preencha todos os campos da retirada."
            );

            return;

        }


        if (
            toalha.status !==
            "Disponível"
        ) {

            alert(
                "Esta toalha não está disponível."
            );

            atualizarListas();

            return;

        }


        toalha.status =
            "Em uso";


        /*
            Guarda também quem retirou a toalha.
            Isso permite recuperar o nadador
            relacionado posteriormente.
        */

        toalha.nadadorId =
            nadador.id;


        toalha.nadadorNome =
            nadador.nome;


        salvarDados(
            STORAGE.toalhas,
            toalhas
        );


        registrarMovimentacao(
            "Retirada",
            toalha,
            funcionario,
            nadador,
            dataRetirada.value
        );


        alert(
            "Retirada registrada com sucesso!"
        );


        formRetirada.reset();


        definirDataAtual();


        atualizarListas();

    }
);


/*REGISTRAR DEVOLUÇÃO*/

formDevolucao.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const funcionarios =
            carregarDados(
                STORAGE.funcionarios
            );


        const toalhas =
            carregarDados(
                STORAGE.toalhas
            );


        const funcionario =
            buscarPorId(
                funcionarios,
                selectFuncionarioDevolucao.value
            );


        const toalha =
            buscarPorId(
                toalhas,
                selectToalhaDevolucao.value
            );


        if (
            !funcionario ||
            !toalha ||
            !dataDevolucao.value
        ) {

            alert(
                "Preencha todos os campos da devolução."
            );

            return;

        }


        if (
            toalha.status !==
            "Em uso"
        ) {

            alert(
                "Esta toalha não está em uso."
            );

            atualizarListas();

            return;

        }


        const nadador = {

            id:
                toalha.nadadorId || null,

            nome:
                toalha.nadadorNome || null

        };


        registrarMovimentacao(
            "Devolução",
            toalha,
            funcionario,
            nadador.id
                ? nadador
                : null,
            dataDevolucao.value
        );


        toalha.status =
            "Disponível";


        delete toalha.nadadorId;

        delete toalha.nadadorNome;


        salvarDados(
            STORAGE.toalhas,
            toalhas
        );


        alert(
            "Devolução registrada com sucesso!"
        );


        formDevolucao.reset();


        definirDataAtual();


        atualizarListas();

    }
);


/*ATUALIZAR AO VOLTAR PARA A PÁGINA*/

window.addEventListener(
    "pageshow",
    function () {

        atualizarListas();

    }
);


/*ATUALIZAR CASO O LOCALSTORAGE MUDE*/

window.addEventListener(
    "storage",
    function (event) {

        if (
            event.key === STORAGE.nadadores ||
            event.key === STORAGE.funcionarios ||
            event.key === STORAGE.toalhas
        ) {

            atualizarListas();

        }

    }
);

atualizarListas();

definirDataAtual();