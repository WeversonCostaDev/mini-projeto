import type {produto} from "./types/produto.ts";
import {produtos} from "./types/produto.ts";


function ativarCadastro() : void{
    const formulario = document.querySelector<HTMLFormElement>(".formulario-produto");
    if(!formulario){
        return;
    }
    formulario.addEventListener("submit", cadastrar);
}

async function cadastrar(event: SubmitEvent): Promise<void>{

    console.log("cadastrar sendo chamado")
    event.preventDefault();

    const formulario = event.currentTarget as HTMLFormElement;
    const dados = new FormData(formulario);
    let imagemTratada:string = "";
    
    const arquivo = dados.get("icone");
    if(arquivo instanceof File) {
        try
        {
            imagemTratada = await converterImagemParaBase64(arquivo);
        }
        catch(erro){
            alert(erro);
        return;
        }
    }

    const produto:produto = {
        id: 
        Date.now(),
        nome: String(dados.get("nome")),
        preco: Number(dados.get(("preco"))),
        emEstoque: Number(dados.get("quantidade"))>=1,
        quantidade: Number(dados.get("quantidade")),
        icone: imagemTratada,
    }
    console.log(produto);
    console.log(produtos);
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


ativarCadastro();