

type produto = {
    id: number,
    nome: string,
    preco: number,
    emEstoque: boolean,
    quantidade: number,
    icone: string,
}

let produtos: produto[] = [
    {
        id: 1,
        nome: "mouse",
        preco: 200.00,
        emEstoque: true,
        quantidade: 30,
        icone: "/icons/mouse.svg",
    },
    {
        id: 2,
        nome: "headphone",
        preco: 360.00,
        emEstoque: true,
        quantidade: 2,
        icone: "/icons/headphones.svg",
    },
    {
        id: 3,
        nome: "teclado",
        preco: 240.00,
        emEstoque: true,
        quantidade: 13,
        icone: "/icons/teclado.svg",
    },
];

let produtoEdicao : produto | null = null;

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

function barraPesquisa():void{
    const barra = document.getElementById("pesquisa") as HTMLInputElement;

    let temporizador: number;

    barra.addEventListener("input", ():void =>{
        clearTimeout(temporizador);

        temporizador = window.setTimeout(()=>{

            const textoPesquisa = barra.value;
            const produtosFiltrados = produtos.filter(p => p.nome.includes(textoPesquisa));
            exibirProdutos(produtosFiltrados);
        }, 1000);
    });
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
        <button type="button" class="botao-editar" aria-label="Editar produto">
            <svg class="editar" class="icone" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil preview-icon"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
        </button>
        <button type="button" class="botao-excluir" aria-label="Excluir produto">
            <svg class="excluir" class="icone" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash preview-icon"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>    
        </div>
    `;
    const modalProduto = document.getElementById("modal-produto");
    const botaoEditar = card.querySelector<HTMLButtonElement>(".botao-editar");
    const botaoExcluir = card.querySelector<HTMLButtonElement>(".botao-excluir");

    if(!modalProduto || !botaoEditar || !botaoExcluir) throw new Error("Elemento não encontrado!");
    
    botaoEditar.addEventListener("click", (): void =>{
        produtoEdicao = produto;
        const nomeInput = document.getElementById("nome") as HTMLInputElement;
        const precoInput = document.getElementById("preco") as HTMLInputElement;
        const quantidadeInput = document.getElementById("quantidade") as HTMLInputElement;

        nomeInput.value = produto.nome;
        precoInput.value = produto.preco.toString();
        quantidadeInput.value = produto.quantidade.toString();

        modalProduto.classList.remove("oculto");
    });

    botaoExcluir.addEventListener("click", () => {
        const novaLista = produtos.filter(p => p.id != produto.id);
        produtos = novaLista;
    });

    areaProdutos.appendChild(card);
}


/* ================================== FORMULARIO ======================================= */
import { configurarModal } from "./configuracoes.ts";

function ativarCadastro() : void{
    const formulario = document.querySelector<HTMLFormElement>(".formulario-produto");
    if(!formulario){
        return;
    }
    formulario.addEventListener("submit", cadastrar);
}

async function cadastrar(event: SubmitEvent): Promise<void>{
    event.preventDefault();

    const formulario = event.currentTarget as HTMLFormElement;
    const dados = new FormData(formulario);
    let imagemTratada:string ="";
    const arquivo = dados.get("icone");

    if (arquivo instanceof File && arquivo.size > 0) {
        try {
            imagemTratada = await converterImagemParaBase64(arquivo);
        } catch (erro) 
        {
            alert(erro);
            return;
        }
    }

    else{
        alert("Selecione uma imagem.");
        return;
    }

    if(produtoEdicao){
        produtoEdicao.nome = String(dados.get("nome")).toLocaleLowerCase().trim();
        produtoEdicao.preco = Number(dados.get("preco"));
        produtoEdicao.quantidade = Number(dados.get("quantidade"));
        produtoEdicao.emEstoque = produtoEdicao.quantidade >= 1;
        produtoEdicao.icone = imagemTratada;
        produtoEdicao = null;
        return;
    }
    
    const produto:produto = {
        id: Date.now(),
        nome: String(dados.get("nome")),
        preco: Number(dados.get(("preco"))),
        emEstoque: Number(dados.get("quantidade"))>=1,
        quantidade: Number(dados.get("quantidade")),
        icone: imagemTratada!,
    }
    produtos.push(produto);
} 

async function converterImagemParaBase64(arquivo: File): Promise<string>{
    return new Promise(
        (resolve, reject)=>{
            const leitor = new FileReader();

            leitor.onload = () => {
                if (typeof leitor.result === "string"){
                    resolve(leitor.result);
                }
                else{
                    reject(new Error("Não foi possível converter a imagem!"));
                }
            }
            leitor.onerror = () => reject(leitor.error);
            
            leitor.readAsDataURL(arquivo);
        }
    );  
}

function novoProduto(){
    const novoProdutoBotao = document.getElementById("novo-produto") as HTMLButtonElement;
    const modalProduto = document.getElementById("modal-produto") as HTMLElement;

    configurarModal(novoProdutoBotao, modalProduto);
}


function previa() : void{
    const nomeInput = document.getElementById("nome") as HTMLInputElement;
    const precoInput = document.getElementById("preco") as HTMLInputElement;
    const quantidadeInput = document.getElementById("quantidade") as HTMLInputElement;
    const iconeInput = document.getElementById("icone") as HTMLInputElement;

    const previaNome = document.getElementById("previa-nome"); 
    const previaPreco =document.getElementById("previa-preco");
    const previaQuantidade = document.getElementById("previa-quantidade");
    const previaImagem = document.querySelector(".previa-imagem");

    if(!previaNome || !previaPreco || !previaQuantidade || !previaImagem) throw new Error("Propriedades não encontradas");

    nomeInput.addEventListener("input", (): void=>{
        previaNome.textContent = nomeInput.value;
    });
    precoInput.addEventListener("input", ():void  =>{
        previaPreco.textContent = `${Number(precoInput.value).toFixed(2)}`;
    })
    quantidadeInput.addEventListener("input", (): void=>{
        previaQuantidade.textContent = `${quantidadeInput.value} unidades`;
    })
    iconeInput.addEventListener("change", ():void=>{
        const arquivo = iconeInput.files?.[0];
        if(arquivo){
            const urlTemporaria = URL.createObjectURL(arquivo);
            previaImagem.setAttribute("src", urlTemporaria)
        }
    })
}

ativarCadastro();
previa();
novoProduto();
/* ================================== FORMULARIO ======================================= */

exibirProdutos(produtos);
atualizaContagem(produtos);
recarregarItens();
barraPesquisa();