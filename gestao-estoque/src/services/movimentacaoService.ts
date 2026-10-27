import type { movimentacao } from "../types/produto";

export async function buscarMovimentacao(): Promise<movimentacao[]> {
    const resposta = await fetch(`http://localhost:3000/movimentacao`);

    if (!resposta) throw new Error("Erro ao buscar movimentação.");

    const movimentacao: movimentacao[] = await resposta.json();
    return movimentacao;
}

export async function adicionarMovimentacao(novaMovimentacao:movimentacao):Promise<void> {
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