import { Movimentacao } from "../classes/movimentacao.js";

import {
    carregarNadadores
} from "./nadadores.js";

import {
    carregarFuncionarios
} from "./funcionarios.js";

import {
    carregarToalhas
} from "./toalhas.js";


const STORAGE = "movimentacoes";


export function carregarMovimentacoes() {

    try {

        const dados =
            JSON.parse(
                localStorage.getItem(STORAGE)
            ) || [];


        if (!Array.isArray(dados)) {

            return [];

        }


        const nadadores =
            carregarNadadores();

        const funcionarios =
            carregarFuncionarios();

        const toalhas =
            carregarToalhas();


        return dados.map(
            function (movimentacao) {

                const toalha =
                    toalhas.find(
                        function (toalha) {

                            return (
                                String(toalha.id) ===
                                String(movimentacao.toalhaId)
                            );

                        }
                    );


                const funcionario =
                    funcionarios.find(
                        function (funcionario) {

                            return (
                                String(funcionario.id) ===
                                String(movimentacao.funcionarioId)
                            );

                        }
                    );


                const nadador =
                    nadadores.find(
                        function (nadador) {

                            return (
                                String(nadador.id) ===
                                String(movimentacao.nadadorId)
                            );

                        }
                    ) || null;


                return new Movimentacao(
                    movimentacao.id,
                    movimentacao.tipo,
                    toalha,
                    funcionario,
                    nadador,
                    movimentacao.dataHora
                );

            }
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar movimentações:",
            erro
        );

        return [];

    }

}


export function salvarMovimentacoes(movimentacoes) {

    localStorage.setItem(
        STORAGE,
        JSON.stringify(movimentacoes)
    );

}