export class Movimentacao {

    constructor(
        id,
        tipo,
        toalha,
        funcionario,
        nadador,
        dataHora
    ) {

        this.id = id;
        this.tipo = tipo;

        this.toalha = toalha;
        this.funcionario = funcionario;
        this.nadador = nadador || null;

        this.dataHora = dataHora;

    }


    get toalhaId() {

        return this.toalha
            ? this.toalha.id
            : null;

    }


    get toalhaCodigo() {

        return this.toalha
            ? this.toalha.codigo
            : null;

    }


    get funcionarioId() {

        return this.funcionario
            ? this.funcionario.id
            : null;

    }


    get funcionarioNome() {

        return this.funcionario
            ? this.funcionario.nome
            : null;

    }


    get nadadorId() {

        return this.nadador
            ? this.nadador.id
            : null;

    }


    get nadadorNome() {

        return this.nadador
            ? this.nadador.nome
            : null;

    }


    toJSON() {

        return {

            id: this.id,

            tipo: this.tipo,

            toalhaId: this.toalhaId,

            toalhaCodigo: this.toalhaCodigo,

            funcionarioId: this.funcionarioId,

            funcionarioNome: this.funcionarioNome,

            nadadorId: this.nadadorId,

            nadadorNome: this.nadadorNome,

            dataHora: this.dataHora

        };

    }

}