export type produto = {
    id: number,
    nome: string,
    preco: number,
    emEstoque: boolean,
    quantidade: number,
    icone: string,
}

export const produtos: produto[] = [
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