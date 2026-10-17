type produto = {
    id: number,
    nome: string,
    preco: number,
    emEstoque: boolean,
    quantidade: number,
    icone: string,
}

const produtos: produto[] = [
    {
        id: 1,
        nome: "Mouse",
        preco: 200.00,
        emEstoque: true,
        quantidade: 30,
        icone: "/icons/mouse.svg",
    },
    {
        id: 2,
        nome: "Headphone",
        preco: 360.00,
        emEstoque: true,
        quantidade: 2,
        icone: "/icons/headphones.svg",
    },
    {
        id: 3,
        nome: "Teclado",
        preco: 240.00,
        emEstoque: true,
        quantidade: 13,
        icone: "/icons/teclado.svg",
    },
];

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

function exibirProdutos(produtos: produto[]) {
    const areaProdutos = document.getElementById("area-produtos");

    if (!areaProdutos) throw new Error("Elemento #area-produtos não encontrado!");
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