export async function converterImagemParaBase64(arquivo: File): Promise<string> {
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