import type { tipoMovimentacao, produto, movimentacao } from "../types/produto";
import { atualizarProduto } from "../services/produtoService";
import { adicionarMovimentacao, buscarMovimentacao } from "../services/movimentacaoService";

export async function persistirQuantidade(quantidade: number, produto: produto, operador: string): Promise<void> {
    let operacao: number;
    let tipoMovimentacao: tipoMovimentacao;
    if (operador === "+") {
        operacao = produto.quantidade + quantidade;
        tipoMovimentacao = "entrada";
    } else if (operador === "-") {
        operacao = produto.quantidade - quantidade;
        tipoMovimentacao = "saida";
    } else {
        throw new Error("Operador inválido.");
    }
    const produtoAtualizado: Partial<produto> =
    {
        quantidade: operacao,
    };
    await atualizarProduto(produto.id, produtoAtualizado);

    registrarMovimentacao(produto.id, produto.nome, tipoMovimentacao, quantidade);
    window.location.reload();
};

async function registrarMovimentacao(
    idProduto: string,
    nomeProduto: string,
    tipo: tipoMovimentacao,
    quantidade: number
): Promise<void> {

    const novaMovimentacao: movimentacao = {
        id: Date.now(),
        idProduto: idProduto,
        nomeProduto,
        tipo,
        quantidade,
        data: new Date(),
    }

    await adicionarMovimentacao(novaMovimentacao);
}

export async function exibirMovimentacao(): Promise<void> {
    const movimentacao: movimentacao[] = await buscarMovimentacao();
    const historico = document.getElementById("historico-movimentacoes");
    if (!historico) throw new Error("Elemento histórico não encontrado!");

    historico.innerHTML = "";

    if (!movimentacao) {
        historico.textContent = "Histórico não encontrado";
    }

    movimentacao.forEach(movimentacao => {
        const item = document.createElement("div");
        item.classList.add("item-movimentacao");

        const dataFormatada = new Date(movimentacao.data).toLocaleString("pt-BR");

        item.innerHTML =
            `
            <div>
                <strong>${movimentacao.nomeProduto}</strong>
                <p>${dataFormatada}</p>
            </div>
            <div class="${movimentacao.tipo}">
                <span>${movimentacao.tipo}</span>
                <p>${movimentacao.tipo === "entrada" ? "+" : "-"} ${movimentacao.quantidade}</p>
            </div>
        `;
        historico.append(item);
    });
}

export function ativarHistorico(): void {
    const botao = document.getElementById("exibir-historico");
    const modal = document.getElementById("historico");

    if (!botao || !modal) {
        throw new Error("Botão ou modal do histórico não encontrado.");
    }

    botao.addEventListener("click", () => {
        modal.classList.remove("oculto");
        void exibirMovimentacao();
    });
}