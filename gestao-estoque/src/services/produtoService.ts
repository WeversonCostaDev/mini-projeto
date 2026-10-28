import type {produto} from "../types/produto.ts";

export class ProdutoApi{
    private readonly url = "http://localhost:3000/produtos";

    async buscarProdutos(): Promise<produto[]> {

        const resposta = await fetch(this.url);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar produtos");
        }

        const produtos: produto[] = await resposta.json();
        return produtos;
    }

    async excluirProduto(produtoId:string) {
        const resposta = await fetch(
                `${this.url}/${produtoId}`,
                {
                    method: "DELETE"
                });

            if (!resposta.ok) {
                throw new Error("Erro ao excluir produto");
            }
    }

    async atualizarProduto(produtoId:string, produtoAtualizado: Partial<produto>):Promise<void> {
        
        console.log("entrou em atualizarProduto")
        const resposta = await fetch(
            `${this.url}/${produtoId}`,

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

    async registrarProduto(produto: produto): Promise<void> {
        const resposta = await fetch(
            `${this.url}`, {
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
}