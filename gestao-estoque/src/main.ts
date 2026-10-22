import type { produto } from "./types/produto.ts";
import type { tipoMovimentacao } from "./types/produto.ts";
import type { movimentacao } from "./types/produto.ts";

function exibirHistorico(): void {
    const botao = document.getElementById("exibir-historico") as HTMLButtonElement;
    botao.addEventListener("click", () => {
        const modal = document.getElementById("historico") as HTMLElement;
        modal.classList.remove("oculto");
    });
}

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

function barraPesquisa(): void {
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

async function buscarProdutos(): Promise<produto[]> {

    const resposta = await fetch("http://localhost:3000/produtos");

    if (!resposta.ok) {
        throw new Error("Erro ao buscar produtos");
    }

    const produtos: produto[] = await resposta.json();
    return produtos;
}

/*Adicionado ao final para registrar a função ao botão de recarregar produtos*/
async function recarregarItens() {
    const botao = document.getElementById("recarrega-itens");
    if (!botao) throw new Error("Elemento de id #recarrega-itens não encontrado");

    botao.addEventListener("click", () => inicializar());
}

async function exibirProdutos(produtos: produto[]): Promise<void> {

    const areaProdutos = document.getElementById("area-produtos");

    if (!areaProdutos) throw new Error("Elemento de id #area-produtos não encontrado!");
    areaProdutos.innerHTML = "";
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
        const resposta = await fetch(
            `http://localhost:3000/produtos/${produto.id}`,
            {
                method: "DELETE"
            });

        if (!resposta.ok) {
            throw new Error("Erro ao excluir produto");
        }
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

async function persistirQuantidade(quantidade: number, produto: produto, operador: string): Promise<void> {
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
    const resposta = await fetch(
        `http://localhost:3000/produtos/${produto.id}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(produtoAtualizado)
        }
    );
    if (!resposta.ok) throw new Error("Erro ao atualizar o produto.");

    registrarMovimentacao(produto.id, produto.nome, tipoMovimentacao, quantidade);
    window.location.reload();
};


function editarProduto(produto: produto): void {
    const modalProduto = document.getElementById("modal-editar-produto");
    if (!modalProduto) {
        throw new Error("Modal não encontrado.");
    };
    modalProduto.classList.remove("oculto");

    const nomeInput = modalProduto.querySelector<HTMLInputElement>("#modal-editar-produto #nome");
    const precoInput = modalProduto.querySelector<HTMLInputElement>("#modal-editar-produto #preco");
    const quantidadeInput = modalProduto.querySelector<HTMLInputElement>("#modal-editar-produto #quantidade");

    if (!nomeInput || !precoInput || !quantidadeInput) throw new Error("Elementos de Input não encontrados.");

    nomeInput.value = produto.nome;
    precoInput.value = produto.preco.toString();
    quantidadeInput.value = produto.quantidade.toString();

    const formulario = modalProduto.querySelector<HTMLFormElement>("#formulario-editar-produto");
    if (!formulario) throw new Error("Formulário não encotrado.");
    formulario.dataset.produtoId = String(produto.id);

    if (!formulario) {
        throw new Error("Formulário de edição não encontrado.");
    }

    formulario.dataset.produtoId = String(produto.id);

}

function ativarEdicao(): void {
    const formulario = document.querySelector<HTMLFormElement>("#formulario-editar-produto");
    if (!formulario) throw new Error("Formulário não encontrado.");

    formulario.addEventListener("submit", salvarEdicao);
}

async function salvarEdicao(): Promise<void> {

    const formulario = document.querySelector<HTMLFormElement>("#formulario-editar-produto");
    if (!formulario) throw new Error("Formulário não encontrado.");
    const dados = new FormData(formulario);

    const produtoId = formulario.dataset.produtoId;

    const produtoAtualizado: Partial<produto> = {
        nome: String(dados.get("nome")).trim(),
        preco: Number(dados.get("preco")),
        quantidade: Number(dados.get("quantidade")),
        emEstoque: Number(dados.get("quantidade")) > 0,
    };
    const resposta = await fetch(
        `http://localhost:3000/produtos/${produtoId}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(produtoAtualizado)
        }
    )
    if (!resposta.ok) throw new Error("Erro ao atualizar o produto.");

    formulario.reset();

    const modalProduto = document.getElementById("modal-editar-produto");

    if (!modalProduto) {
        throw new Error("Modal de edição não encontrado.");
    }

    modalProduto.classList.add("oculto");
};


async function buscarMovimentacao(): Promise<movimentacao[]> {
    const resposta = await fetch(`http://localhost:3000/movimentacao`);

    if (!resposta) throw new Error("Erro ao buscar movimentação.");

    const movimentacao: movimentacao[] = await resposta.json();
    return movimentacao;
}

async function registrarMovimentacao(
    idProduto: number,
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

    const resposta = await fetch(
        `http://localhost:3000/movimentacao`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(novaMovimentacao)
    });
    if (!resposta.ok) throw new Error("Erro ao registrar movimentação.");
}

async function exibirMovimentacao(): Promise<void> {
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

async function inicializar(): Promise<void> {
    const produtos = await buscarProdutos();
    await exibirProdutos(produtos);
    atualizaContagem(produtos);
}

/* ================================== FORMULARIO ======================================= */
function ativarCadastro(): void {
    const formulario = document.querySelector<HTMLFormElement>(".formulario-produto");
    if (!formulario) {
        throw new Error("Elemento formulário não encontrado.");
    }
    formulario.addEventListener("submit", cadastrar);
}

async function cadastrar(event: SubmitEvent): Promise<void> {
    //event.preventDefault();
    const formulario = event.currentTarget as HTMLFormElement;
    const dados = new FormData(formulario);
    let imagemTratada: string = "";
    const arquivo = dados.get("icone");

    if (arquivo instanceof File && arquivo.size > 0) {
        try {
            imagemTratada = await converterImagemParaBase64(arquivo);
            console.log("Tamanho original:", arquivo.size);
            console.log("Tamanho Base64:", imagemTratada.length);
        } catch (erro) {
            alert(erro);
            return;
        }
    }

    else {
        alert("Selecione uma imagem.");
        return;
    }

    const produto: produto = {
        id: Date.now(),
        nome: String(dados.get("nome")).toLowerCase().trim(),
        preco: Number(dados.get(("preco"))),
        emEstoque: Number(dados.get("quantidade")) >= 1,
        quantidade: Number(dados.get("quantidade")),
        icone: imagemTratada!,
    }
    await registrarProduto(produto);
}

async function registrarProduto(produto: produto): Promise<void> {
    const resposta = await fetch(
        `http://localhost:3000/produtos`, {
        method: "POST",
        headers:
        {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(produto)
    }
    );
    if (!resposta.ok) {
        const erro = await resposta.text();

        console.error("Erro ao cadastrar:", resposta.status, erro);
        alert("Não foi possível cadastrar o produto. Veja o Console.");

        return;
    }

    console.log("Produto cadastrado com sucesso!");
}

async function converterImagemParaBase64(arquivo: File): Promise<string> {
    return new Promise(
        (resolve, reject) => {
            const leitor = new FileReader();

            leitor.onload = () => {
                if (typeof leitor.result === "string") {
                    resolve(leitor.result);
                }
                else {
                    reject(new Error("Não foi possível converter a imagem!"));
                }
            }
            leitor.onerror = () => reject(leitor.error);

            leitor.readAsDataURL(arquivo);
        }
    );
}

function novoProduto(): void {
    const novoProdutoBotao = document.getElementById("novo-produto") as HTMLButtonElement;
    const modalProduto = document.getElementById("modal-produto") as HTMLElement;

    novoProdutoBotao.addEventListener("click", () => {
        modalProduto.classList.remove("oculto");
    });
    modalProduto.addEventListener("click", (event) => {
        if (event.target === modalProduto) {
            modalProduto.classList.add("oculto");
        }
    })
}

function previa(): void {
    const nomeInput = document.getElementById("nome") as HTMLInputElement;
    const precoInput = document.getElementById("preco") as HTMLInputElement;
    const quantidadeInput = document.getElementById("quantidade") as HTMLInputElement;
    const iconeInput = document.getElementById("icone") as HTMLInputElement;

    const previaNome = document.getElementById("previa-nome");
    const previaPreco = document.getElementById("previa-preco");
    const previaQuantidade = document.getElementById("previa-quantidade");
    const previaImagem = document.querySelector(".previa-imagem");

    if (!previaNome || !previaPreco || !previaQuantidade || !previaImagem) throw new Error("Propriedades não encontradas");

    nomeInput.addEventListener("input", (): void => {
        previaNome.textContent = nomeInput.value;
    });
    precoInput.addEventListener("input", (): void => {
        previaPreco.textContent = `${Number(precoInput.value).toFixed(2)}`;
    })
    quantidadeInput.addEventListener("input", (): void => {
        previaQuantidade.textContent = `${quantidadeInput.value} unidades`;
    })
    iconeInput.addEventListener("change", (): void => {
        const arquivo = iconeInput.files?.[0];
        if (arquivo) {
            const urlTemporaria = URL.createObjectURL(arquivo);
            previaImagem.setAttribute("src", urlTemporaria)
        }
    })
}

function modalEfeitoFechamento() {

    const modais = document.querySelectorAll(".modal-ovelay");
    modais.forEach(modal => {
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                modal.classList.add("oculto");
            }
        });
    });
}

ativarCadastro();
previa();
novoProduto();
/* ================================== FORMULARIO ======================================= */

inicializar();
recarregarItens();
barraPesquisa();
exibirMovimentacao();
exibirHistorico();
modalEfeitoFechamento();
ativarEdicao();

//Adicionar movimentacao na funcao de editar produtos