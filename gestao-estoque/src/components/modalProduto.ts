import type { produto,arquivoOpcional } from "../types/produto";
import { converterImagemParaBase64 } from "../utils/imagem";
import { registrarProduto, atualizarProduto } from "../services/produtoService";

export function previa(): void {
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

export function novoProduto(): void {
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
        id: String(Date.now()),
        nome: String(dados.get("nome")).toLowerCase().trim(),
        preco: Number(dados.get(("preco"))),
        emEstoque: Number(dados.get("quantidade")) >= 1,
        quantidade: Number(dados.get("quantidade")),
        icone: imagemTratada!,
    }
    await registrarProduto(produto);
}

async function salvarEdicao(): Promise<void> {

    const formulario = document.querySelector<HTMLFormElement>("#formulario-editar-produto");
    if (!formulario) throw new Error("Formulário não encontrado.");
    const dados = new FormData(formulario);

    const produtoId = String(formulario.dataset.produtoId);

    const valorArquivo = dados.get("icone");
    const arquivoIcone: arquivoOpcional = valorArquivo instanceof File ? valorArquivo : null;

    const produtoAtualizado: Partial<produto> = {
        nome: String(dados.get("nome")).trim(),
        preco: Number(dados.get("preco")),
        quantidade: Number(dados.get("quantidade")),
        emEstoque: Number(dados.get("quantidade")) > 0,
    
    };

    if(arquivoIcone){
        const iconeAtualizado = await converterImagemParaBase64(arquivoIcone);
        produtoAtualizado.icone = iconeAtualizado;
    }

    await atualizarProduto(produtoId, produtoAtualizado);

    formulario.reset();

    const modalProduto = document.getElementById("modal-editar-produto");

    if (!modalProduto) {
        throw new Error("Modal de edição não encontrado.");
    }

    modalProduto.classList.add("oculto");
};

export function editarProduto(produto: produto): void {
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

    console.log("ID do produto ao abrir edição:", formulario.dataset.produtoId);
}

export function modalEfeitoFechamento() {

    const modais = document.querySelectorAll(".modal-ovelay");
    modais.forEach(modal => {
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                modal.classList.add("oculto");
            }
        });
    });
}

export function ativarCadastro(): void {
    const formulario = document.querySelector<HTMLFormElement>(".formulario-produto");
    if (!formulario) {
        throw new Error("Elemento formulário não encontrado.");
    }
    formulario.addEventListener("submit", cadastrar);
}
export function ativarEdicao(): void {
    const formulario = document.querySelector<HTMLFormElement>("#formulario-editar-produto");
    if (!formulario) throw new Error("Formulário não encontrado.");

    formulario.addEventListener("submit", salvarEdicao);
}