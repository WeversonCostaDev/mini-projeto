import type {produto} from "../types/produto.ts";
import { buscarProdutos, excluirProduto } from "../services/produtoService.ts";
import { editarProduto } from "./modalProduto.ts";
import { persistirQuantidade } from "./movimentacao.ts";

export function barraPesquisa(): void {
    const barra = document.getElementById("pesquisa") as HTMLInputElement;

    let temporizador: number;

    barra.addEventListener("input", (): void => {
        clearTimeout(temporizador);

        temporizador = window.setTimeout(async () => {

            const textoPesquisa = barra.value;
            const produtos: produto[] = await buscarProdutos();
            const produtosFiltrados = produtos.filter(p => p.nome.includes(textoPesquisa));
            exibirProdutos(produtosFiltrados);
        }, 1000);
    });
}

export async function exibirProdutos(produtos: produto[]): Promise<void> {

    const areaProdutos = document.getElementById("area-produtos");

    if (!areaProdutos) throw new Error("Elemento de id #area-produtos não encontrado!");
    areaProdutos.innerHTML = "";
    produtos.forEach(produto => exibirProduto(produto, areaProdutos));
}

export function exibirProduto(produto: produto, areaProdutos: HTMLElement): void {
    const card = document.createElement("div");
    card.classList.add("card-produto");

    card.innerHTML =
        `
    <div>
        <img class="icone icone-produto" src="${produto.icone}" alt="icone ${produto.nome}">
        <div>
            <p class="produto">${produto.nome}</p>
            <p class="preco">R$ ${produto.preco.toFixed(2)}</p>
        </div>
    </div>
    <div>                 
        <button class="botao-adicionar" type="submit">+</button>
        <input class="quantidade" type="number" min="1">
        <button class="botao-diminuir" type="button">-</button>
        </form>
    </div>
    <div>
        <span class="quantidade">${produto.quantidade} uni.</span>
        <button type="button" class="botao-editar" aria-label="Editar produto">
            <svg class="editar" class="icone" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil preview-icon"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
        </button>
        <button type="button" class="botao-excluir" aria-label="Excluir produto">
            <svg class="excluir" class="icone" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash preview-icon"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>    
    </div>
    `;

    aplicaEfeitoBotoes(card, produto);

    areaProdutos.appendChild(card);
}

function aplicaEfeitoBotoes(card: HTMLElement, produto: produto): void {
    const modalProduto = document.getElementById("modal-produto");
    const botaoEditar = card.querySelector<HTMLButtonElement>(".botao-editar");
    const botaoExcluir = card.querySelector<HTMLButtonElement>(".botao-excluir");

    const quantidadeInput = card.querySelector<HTMLInputElement>(".quantidade");
    const botaoAdicionar = card.querySelector<HTMLButtonElement>(".botao-adicionar");
    const botaoDiminuir = card.querySelector<HTMLButtonElement>(".botao-diminuir");

    if (!modalProduto || !botaoEditar || !botaoExcluir || !botaoAdicionar || !botaoDiminuir || !quantidadeInput) throw new Error("Elemento não encontrado!");

    botaoEditar.addEventListener("click", (): void => {
        editarProduto(produto);
    });

    botaoExcluir.addEventListener("click", async () => {
        excluirProduto(produto.id);
        window.location.reload();
    });


    botaoAdicionar.addEventListener("click", async () => {

        const quantidade = Number(quantidadeInput.value);

        if (!Number.isInteger(quantidade) || quantidade < 1) {
            alert("Digite uma quantidade inteira maior que zero.");
            return;
        }
        persistirQuantidade(Number(quantidadeInput.value), produto, "+");
    });
    botaoDiminuir.addEventListener("click", async () => {
        const quantidade = Number(quantidadeInput.value)
        if (!Number.isInteger(quantidade) || quantidade < 1) {
            alert("Digite uma quantidade inteira maior que zero.");
            return;
        }
        if (0 > (produto.quantidade - quantidade)) {
            alert("Não é possível retirar quantidade maior que a disponível.")
            return;
        }
        persistirQuantidade(quantidade, produto, "-");
    })
}


export function atualizaContagem(produtos: produto[]): void {
    const quantidades = document.querySelectorAll(".menu-navegacao .quantidade");
    quantidades[0].textContent = `${produtos.length}`;


    const totalUnidades = produtos.reduce(
        (total, produto) => total + produto.quantidade, 0);

    quantidades[1].textContent = `${totalUnidades}`;

    const poucasUnidades = produtos.filter(
        produto => produto.quantidade <= 5
    ).length;

    quantidades[2].textContent = `${poucasUnidades}`

}


