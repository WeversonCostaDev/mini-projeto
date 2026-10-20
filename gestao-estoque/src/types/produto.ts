export type produto = {
    id: number,
    nome: string,
    preco: number,
    emEstoque: boolean,
    quantidade: number,
    icone: string,
}

export type tipoMovimentacao = "entrada" | "saida";

export interface movimentacao {
    id: number,
    idProduto: number;
    nomeProduto: string;
    tipo:tipoMovimentacao;
    quantidade: number;
    data: Date;
}