import type {produto} from "./types/produto.ts";
import {produtos} from "./types/produto.ts";

function atualizaContagem(produtos: produto[]): void {
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

function recarregarItens(){
    const botao = document.getElementById("recarrega-itens");
    if(!botao) throw new Error("Elemento de id #recarrega-itens não encontrado");

    botao.addEventListener("click", () => exibirProdutos(produtos));
    botao.addEventListener("click", () => atualizaContagem(produtos));
}   

function exibirProdutos(produtos: produto[]):void {
    const areaProdutos = document.getElementById("area-produtos");

    if (!areaProdutos) throw new Error("Elemento de id #area-produtos não encontrado!");
    areaProdutos.innerHTML="";
    produtos.forEach(produto => exibirProduto(produto, areaProdutos));
}

function exibirProduto(produto: produto, areaProdutos: HTMLElement): void {
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
        <span class="quantidade">${produto.quantidade} uni.</span>
        <svg class="editar" class="icone" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil preview-icon"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
        <svg class="excluir" class="icone" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash preview-icon"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
    </div>
    `;
    areaProdutos.appendChild(card);
}

exibirProdutos(produtos);
atualizaContagem(produtos);
recarregarItens();