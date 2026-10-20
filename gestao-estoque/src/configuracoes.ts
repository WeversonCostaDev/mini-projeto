export function configurarModal(botaoAbrir: HTMLElement, modal: HTMLElement): void {
    botaoAbrir.addEventListener("click", () => {
        modal.classList.remove("oculto");
    });

    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.classList.add("oculto");
        }
    });
}