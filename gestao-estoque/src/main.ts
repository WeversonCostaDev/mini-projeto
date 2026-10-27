
import { buscarProdutos } from "./services/produtoService.ts";
import {
    barraPesquisa,
    exibirProdutos,
    atualizaContagem
} from "./components/produto.ts";

import {
    ativarCadastro,
    previa,
    novoProduto,
    modalEfeitoFechamento,
    ativarEdicao
} from "./components/modalProduto.ts";

import { 
    exibirMovimentacao,
    ativarHistorico,    
 } from "./components/movimentacao.ts";

async function inicializar(): Promise<void> {
    try {
        const produtos = await buscarProdutos();

        await exibirProdutos(produtos);
        atualizaContagem(produtos);
    } catch (erro) {
        console.error("Erro ao carregar produtos:", erro);
    }
}

function configurarEventos(): void {
    ativarCadastro();
    previa();
    novoProduto();
    barraPesquisa();
    exibirMovimentacao();
    modalEfeitoFechamento();
    ativarEdicao();
    ativarHistorico();

    const botao = document.getElementById("recarrega-itens");

    if (!botao) {
        throw new Error("Elemento #recarrega-itens não encontrado");
    }

    botao.addEventListener("click", () => {
        void inicializar();
    });
}

configurarEventos();
void inicializar();
