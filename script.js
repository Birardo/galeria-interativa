const ListaBotoes = document.querySelectorAll(".filtro");
const ListaImagens = document.querySelectorAll(".miniatura");
const totalImagens = document.getElementById("totalImagens");
const modal = document.getElementById("modal");
const btnFechar = document.getElementById("fechar");
const btnAnterior = document.getElementById("anterior");
const btnProximo = document.getElementById("proximo");
const imagemModal = document.querySelector("#imagemModal");
const contador = document.querySelector("#contador");
const nomeImagem = document.getElementById("nomeImagem");
const menu = document.querySelector('.filtros')

const autorImagem = document.getElementById("autorImagem");
const tipoImagem = document.getElementById("tipoImagem");
const albumImagem = document.getElementById("albumImagem");
const containerAlbum = document.getElementById("containerAlbum");
const anoImagem = document.getElementById("anoImagem");

let imagensVisiveis = [];
let indiceAtual = 0;

// Mapeia e salva os layouts originais de cada imagem antes de aplicar qualquer filtro
const classesLayout = ["destaque", "horizontal", "vertical"];
ListaImagens.forEach((imagem) => {
    const layoutsOriginais = classesLayout.filter((cls) => imagem.classList.contains(cls));
    imagem.dataset.layoutOriginal = layoutsOriginais.join(" ");
});

function atualizarImagensVisiveis() {
    // Considera visíveis apenas as imagens sem a classe "oculta"
    imagensVisiveis = Array.from(ListaImagens).filter((imagem) => !imagem.classList.contains("oculta"));
    totalImagens.textContent = `Exibindo ${imagensVisiveis.length} de ${ListaImagens.length} imagens`;
}

function filtrarImagens(categoria) {
    const ehTodas = categoria === "todas";

    ListaImagens.forEach((imagem) => {
        const categoriaImagem = imagem.dataset.categoria;
        const corresponde = ehTodas || categoriaImagem === categoria;

        if (corresponde) {
            imagem.classList.remove("oculta");
            imagem.tabIndex = 0;

            if (ehTodas) {
                // Volta ao layout original: remove "img-filtrada" e restaura "destaque", "horizontal", etc.
                imagem.classList.remove("img-filtrada");

                if (imagem.dataset.layoutOriginal) {
                    const layouts = imagem.dataset.layoutOriginal.split(" ").filter(Boolean);
                    layouts.forEach((cls) => imagem.classList.add(cls));
                }
            } else {
                // Modo filtrado: adiciona "img-filtrada" e remove classes de layout especial
                imagem.classList.add("img-filtrada");
                imagem.classList.remove(...classesLayout);
            }
        } else {
            imagem.classList.add("oculta");
            imagem.classList.remove(...classesLayout);
            imagem.tabIndex = -1;
        }
    });

    atualizarImagensVisiveis();
}

ListaBotoes.forEach((botao) => {
    botao.addEventListener("click", () => {
        let categoria = botao.dataset.filtro;

        ListaBotoes.forEach((item) => {
            item.classList.remove("ativo");
        });

        botao.classList.add("ativo");
        filtrarImagens(categoria);
    });
});

function mostrarImagem(indice) {
    let quantidade = imagensVisiveis.length;
    if (quantidade === 0) return;

    indiceAtual = (indice + quantidade) % quantidade;

    const imagem = imagensVisiveis[indiceAtual];

    imagemModal.src = imagem.src;
    imagemModal.alt = imagem.alt;
    nomeImagem.textContent = imagem.alt;
    contador.textContent = `${indiceAtual + 1} de ${quantidade}`;

    const autor = imagem.dataset.autor || "Não informado";
    const tipo = imagem.dataset.tipo || "Single";
    const album = imagem.dataset.album || "";
    const ano = imagem.dataset.ano || "N/A";

    autorImagem.textContent = autor;
    tipoImagem.textContent = tipo;
    anoImagem.textContent = ano;

    if (album.trim() !== "") {
        albumImagem.textContent = album;
        containerAlbum.classList.remove("oculto");
    } else {
        containerAlbum.classList.add("oculto");
    }
}

function abrirModal(imagem) {
    indiceAtual = imagensVisiveis.indexOf(imagem);
    if (indiceAtual === -1) return;

    modal.classList.add("ativo");
    modal.setAttribute("aria-hidden", "false");
    mostrarImagem(indiceAtual);
}

ListaImagens.forEach((imagem) => {
    imagem.addEventListener("click", function () {
        abrirModal(imagem);
    });

    imagem.addEventListener("keydown", function (evento) {
        if (evento.key === "Enter" || evento.key === " ") {
            evento.preventDefault();
            abrirModal(imagem);
        }
    });
});

btnFechar.addEventListener("click", () => {
    modal.classList.remove("ativo");
    modal.setAttribute("aria-hidden", "true");
});

btnProximo.addEventListener("click", () => {
    mostrarImagem(indiceAtual + 1);
});

btnAnterior.addEventListener("click", () => {
    mostrarImagem(indiceAtual - 1);
});

modal.addEventListener("click", (evento) => {
    if (evento.target === modal) {
        modal.classList.remove("ativo");
        modal.setAttribute("aria-hidden", "true");
    }
});

document.addEventListener("keydown", (evento) => {
    if (!modal.classList.contains("ativo")) return;

    if (evento.key === "Escape") {
        modal.classList.remove("ativo");
        modal.setAttribute("aria-hidden", "true");
    }
    if (evento.key === "ArrowRight") {
        mostrarImagem(indiceAtual + 1);
    }
    if (evento.key === "ArrowLeft") {
        mostrarImagem(indiceAtual - 1);
    }
});


function aparecerMenu() {
    menu.classList.toggle("aberto");
}

function mudarTamanho() {
    if (window.innerWidth >= 768) {
        menu.classList.remove("aberto");
        menu.style.display = "";
    }
}

filtrarImagens("todas");