import type {produto} from "../types/produto.ts";

export async function buscarProdutos(): Promise<produto[]> {

    const resposta = await fetch("http://localhost:3000/produtos");

    if (!resposta.ok) {
        throw new Error("Erro ao buscar produtos");
    }

    const produtos: produto[] = await resposta.json();
    return produtos;
}

export async function excluirProduto(produtoId:number) {
    const resposta = await fetch(
            `http://localhost:3000/produtos/${produtoId}`,
            {
                method: "DELETE"
            });

        if (!resposta.ok) {
            throw new Error("Erro ao excluir produto");
        }
}

export async function atualizarProduto(produtoId:string, produtoAtualizado: Partial<produto>):Promise<void> {
    
    console.log("entrou em atualizarProduto")
    const resposta = await fetch(
        `http://localhost:3000/produtos/${produtoId}`,

        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body:JSON.stringify(produtoAtualizado)
        }
    );
    if (!resposta.ok) 
    {
        const mensagem = await resposta.text();
        throw new Error( `Erro ao atualizar produto: ${resposta.status} - ${mensagem}`);
    }
}

export async function registrarProduto(produto: produto): Promise<void> {
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
        throw new Error(await resposta.text());
    }
}